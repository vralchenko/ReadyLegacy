import { getDb, schema } from '../_lib/db';
import { hashPassword, signToken } from '../_lib/auth';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq } from 'drizzle-orm';

export async function onRequest(context: CFContext): Promise<Response> {
  try {
    if (context.request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const { email, password, name } = (await context.request.json()) as any;
    if (!email || !password || !name) {
      return json({ error: 'Email, password, and name are required' }, 400);
    }
    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, 400);
    }

    const db = getDb(context.env.DATABASE_URL);
    const existing = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return json({ error: 'An account with this email already exists' }, 409);
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(schema.users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name,
        provider: 'email',
        plan: 'free',
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        plan: schema.users.plan,
        provider: schema.users.provider,
      });

    const token = await signToken({ userId: user.id, email: user.email }, context.env.JWT_SECRET);
    return json({ token, user }, 201);
  } catch (err: any) {
    console.error('Register error:', err);
    return json({ error: err.message || 'Internal server error' }, 500);
  }
}
