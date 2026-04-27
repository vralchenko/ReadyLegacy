import { getDb, schema } from '../../_lib/db';
import { getUserId } from '../../_lib/middleware';
import { json } from '../../_lib/types';
import type { CFContext } from '../../_lib/types';
import { eq, and } from 'drizzle-orm';
import { generateSecret, generateUri } from '../../_lib/totp';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const db = getDb(context.env.DATABASE_URL);

  // Check if MFA already enabled
  const [existing] = await db
    .select()
    .from(schema.userData)
    .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, '_mfa_enabled')))
    .limit(1);

  if (existing && (existing.value as any) === true) {
    return json({ error: 'MFA is already enabled' }, 400);
  }

  // Get user email for TOTP URI
  const [user] = await db
    .select({ email: schema.users.email })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  if (!user) return json({ error: 'User not found' }, 404);

  const secret = generateSecret();
  const uri = generateUri(secret, user.email);

  // Store pending setup (overwrite if exists)
  await db.insert(schema.userData)
    .values({ userId, key: '_mfa_pending_setup', value: { secret, createdAt: Date.now() } })
    .onConflictDoUpdate({
      target: [schema.userData.userId, schema.userData.key],
      set: { value: { secret, createdAt: Date.now() }, updatedAt: new Date() },
    });

  return json({ uri, secret });
}
