import { getDb, schema } from '../_lib/db';
import { getUserId } from '../_lib/middleware';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq } from 'drizzle-orm';
import { logAudit, getRequestMeta } from '../_lib/audit';

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
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  if (!user) return json({ error: 'User not found' }, 404);

  const meta = getRequestMeta(context.request);
  context.waitUntil(logAudit(context.env.DATABASE_URL, { userId, action: 'data_export', resource: 'user_data', ...meta }));

  const documents = await db
    .select()
    .from(schema.documents)
    .where(eq(schema.documents.userId, userId));

  const userData = await db
    .select({ key: schema.userData.key, value: schema.userData.value, updatedAt: schema.userData.updatedAt })
    .from(schema.userData)
    .where(eq(schema.userData.userId, userId));

  const exportData = {
    exportedAt: new Date().toISOString(),
    user,
    documents,
    userData,
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="readylegacy-export-${user.email}.json"`,
    },
  });
}
