import { getDb, schema } from '../_lib/db';
import { verifyPassword, signToken } from '../_lib/auth';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq } from 'drizzle-orm';
import { checkRateLimit, rateLimitResponse } from '../_lib/rateLimit';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const ip = context.request.headers.get('cf-connecting-ip') || 'unknown';
  const rl = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000); // 10 per 15 min
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs);

  const { email, password } = (await context.request.json()) as any;
  if (!email || !password) {
    return json({ error: 'Email and password are required' }, 400);
  }

  const db = getDb(context.env.DATABASE_URL);
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    return json({ error: 'Invalid email or password' }, 401);
  }

  if (!user.passwordHash) {
    return json(
      { error: 'This account uses Google sign-in. Please use the Google button.' },
      401,
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return json({ error: 'Invalid email or password' }, 401);
  }

  const token = await signToken({ userId: user.id, email: user.email }, context.env.JWT_SECRET);
  return json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      provider: user.provider,
    },
  });
}
