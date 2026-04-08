import { getDb, schema } from '../_lib/db';
import { getUserId } from '../_lib/middleware';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq } from 'drizzle-orm';
import { logAudit, getRequestMeta } from '../_lib/audit';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'DELETE') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const meta = getRequestMeta(context.request);
  const db = getDb(context.env.DATABASE_URL);

  // Log before deletion (user_id will be gone after CASCADE)
  context.waitUntil(logAudit(context.env.DATABASE_URL, { userId, action: 'account_deleted', resource: 'auth', ...meta }));

  // CASCADE in schema will delete documents + userData automatically
  const deleted = await db
    .delete(schema.users)
    .where(eq(schema.users.id, userId))
    .returning({ id: schema.users.id });

  if (deleted.length === 0) {
    return json({ error: 'User not found' }, 404);
  }

  return json({ ok: true, message: 'Account and all associated data have been permanently deleted.' });
}
