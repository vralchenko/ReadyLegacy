import { getDb, schema } from '../_lib/db';
import { hashPassword } from '../_lib/auth';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq, and } from 'drizzle-orm';
import { checkRateLimit, rateLimitResponse } from '../_lib/rateLimit';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const ip = context.request.headers.get('cf-connecting-ip') || 'unknown';
  const rl = checkRateLimit(`reset:${ip}`, 5, 15 * 60 * 1000); // 5 per 15 min
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs);

  const { email, token, newPassword } = (await context.request.json()) as any;
  if (!email || !token || !newPassword) {
    return json({ error: 'Email, token, and new password are required' }, 400);
  }
  if (newPassword.length < 8) {
    return json({ error: 'Password must be at least 8 characters' }, 400);
  }

  const db = getDb(context.env.DATABASE_URL);

  const [user] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    return json({ error: 'Invalid or expired reset link' }, 400);
  }

  // Fetch stored reset token
  const [tokenRow] = await db
    .select({ value: schema.userData.value })
    .from(schema.userData)
    .where(and(eq(schema.userData.userId, user.id), eq(schema.userData.key, '_reset_token')))
    .limit(1);

  if (!tokenRow) {
    return json({ error: 'Invalid or expired reset link' }, 400);
  }

  const stored = tokenRow.value as { token: string; expiresAt: string };
  if (stored.token !== token || new Date(stored.expiresAt) < new Date()) {
    return json({ error: 'Invalid or expired reset link' }, 400);
  }

  // Update password
  const passwordHash = await hashPassword(newPassword);
  await db
    .update(schema.users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(schema.users.id, user.id));

  // Delete the used reset token
  await db
    .delete(schema.userData)
    .where(and(eq(schema.userData.userId, user.id), eq(schema.userData.key, '_reset_token')));

  return json({ ok: true, message: 'Password has been reset. You can now log in.' });
}
