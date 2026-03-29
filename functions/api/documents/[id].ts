import { getDb, schema } from '../_lib/db';
import { getUserId } from '../_lib/middleware';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq, and } from 'drizzle-orm';

export async function onRequest(context: CFContext): Promise<Response> {
  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const id = context.params.id as string;
  if (!id) return json({ error: 'Document ID required' }, 400);

  const db = getDb(context.env.DATABASE_URL);
  const method = context.request.method;

  if (method === 'GET') {
    const [doc] = await db
      .select()
      .from(schema.documents)
      .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
      .limit(1);
    if (!doc) return json({ error: 'Not found' }, 404);
    return json(doc);
  }

  if (method === 'PUT') {
    const { title, status, data, type, icon } = (await context.request.json()) as any;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (status !== undefined) updates.status = status;
    if (data !== undefined) updates.data = data;
    if (type !== undefined) updates.type = type;
    if (icon !== undefined) updates.icon = icon;

    const [doc] = await db
      .update(schema.documents)
      .set(updates)
      .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
      .returning();
    if (!doc) return json({ error: 'Not found' }, 404);
    return json(doc);
  }

  if (method === 'DELETE') {
    const [doc] = await db
      .delete(schema.documents)
      .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
      .returning({ id: schema.documents.id });
    if (!doc) return json({ error: 'Not found' }, 404);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
