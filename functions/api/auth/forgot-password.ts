import { getDb, schema } from '../_lib/db';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq } from 'drizzle-orm';
import { checkRateLimit, rateLimitResponse } from '../_lib/rateLimit';

// Generate a secure random token using Web Crypto API
async function generateToken(): Promise<string> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const ip = context.request.headers.get('cf-connecting-ip') || 'unknown';
  const rl = checkRateLimit(`forgot:${ip}`, 3, 15 * 60 * 1000); // 3 per 15 min
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs);

  const { email } = (await context.request.json()) as any;
  if (!email) {
    return json({ error: 'Email is required' }, 400);
  }

  const db = getDb(context.env.DATABASE_URL);

  const [user] = await db
    .select({ id: schema.users.id, provider: schema.users.provider })
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);

  // Always return success to prevent email enumeration
  const successMsg = { ok: true, message: 'If an account with this email exists, a reset link has been generated.' };

  if (!user || user.provider !== 'email') {
    return json(successMsg);
  }

  const resetToken = await generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  // Store reset token in userData table
  await db
    .insert(schema.userData)
    .values({
      userId: user.id,
      key: '_reset_token',
      value: { token: resetToken, expiresAt },
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [schema.userData.userId, schema.userData.key],
      set: { value: { token: resetToken, expiresAt }, updatedAt: new Date() },
    });

  // In production, send email with reset link. For now, return token in response
  // for testing. TODO: integrate email service (e.g. Resend, Cloudflare Email Workers)
  const resetUrl = `${new URL(context.request.url).origin}/login?reset=${resetToken}&email=${encodeURIComponent(email.toLowerCase())}`;

  return json({
    ...successMsg,
    // DEV ONLY — remove in production:
    _dev: { resetToken, resetUrl },
  });
}
