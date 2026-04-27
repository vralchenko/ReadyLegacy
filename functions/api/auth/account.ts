import { getDb, schema } from '../_lib/db';
import { getUserId } from '../_lib/middleware';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq, and } from 'drizzle-orm';
import { logAudit, getRequestMeta } from '../_lib/audit';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'DELETE') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const meta = getRequestMeta(context.request);
  const db = getDb(context.env.DATABASE_URL);

  // Soft delete: store deletion timestamp in userData instead of CASCADE DELETE
  const now = new Date().toISOString();
  await db.insert(schema.userData)
    .values({ userId, key: '_account_deleted', value: { deletedAt: now, reason: 'user_request' } as any })
    .onConflictDoUpdate({
      target: [schema.userData.userId, schema.userData.key],
      set: { value: { deletedAt: now, reason: 'user_request' } as any, updatedAt: new Date() },
    });

  // Clear the password hash so they can't log in anymore
  await db.update(schema.users)
    .set({ passwordHash: '__DELETED__', updatedAt: new Date() })
    .where(eq(schema.users.id, userId));

  context.waitUntil(logAudit(context.env.DATABASE_URL, { userId, action: 'account_soft_deleted', resource: 'auth', ...meta }));

  return json({ ok: true, message: 'Your account has been deactivated. Data will be retained per our retention policy (minimum 10 years) and then permanently deleted.' });
}
