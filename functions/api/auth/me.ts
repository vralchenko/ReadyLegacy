import { getDb, schema } from '../_lib/db';
import { getUserId } from '../_lib/middleware';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq, and } from 'drizzle-orm';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const db = getDb(context.env.DATABASE_URL);
  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      plan: schema.users.plan,
      provider: schema.users.provider,
    })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  if (!user) return json({ error: 'User not found' }, 404);

  // Check MFA status
  const [mfaRow] = await db
    .select()
    .from(schema.userData)
    .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, '_mfa_enabled')))
    .limit(1);

  return json({ user: { ...user, mfaEnabled: mfaRow ? (mfaRow.value as boolean) === true : false } });
}
