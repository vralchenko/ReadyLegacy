import { getDb, schema } from '../_lib/db';
import { getUserId } from '../_lib/middleware';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq, and, desc } from 'drizzle-orm';

export async function onRequest(context: CFContext): Promise<Response> {
  try {
    const userId = await getUserId(context.request, context.env.JWT_SECRET);
    if (!userId) return json({ error: 'Unauthorized' }, 401);

    const db = getDb(context.env.DATABASE_URL);
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const method = context.request.method;

    // GET /api/documents — list all
    if (method === 'GET' && !id) {
      const docs = await db
        .select()
        .from(schema.documents)
        .where(eq(schema.documents.userId, userId))
        .orderBy(desc(schema.documents.createdAt));
      return json(docs);
    }

    // GET /api/documents?id=xxx — single doc
    if (method === 'GET' && id) {
      const [doc] = await db
        .select()
        .from(schema.documents)
        .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
        .limit(1);
      if (!doc) return json({ error: 'Not found' }, 404);
      return json(doc);
    }

    // POST /api/documents — create
    if (method === 'POST') {
      const { title, type, icon, data } = (await context.request.json()) as any;
      if (!title) return json({ error: 'Title is required' }, 400);
      const [doc] = await db
        .insert(schema.documents)
        .values({
          userId,
          title,
          type: type || '',
          icon: icon || '\u{1F4C4}',
          data: data || {},
        })
        .returning();
      return json(doc, 201);
    }

    // PUT /api/documents?id=xxx — update
    if (method === 'PUT' && id) {
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

    // DELETE /api/documents?id=xxx — delete
    if (method === 'DELETE' && id) {
      const [doc] = await db
        .delete(schema.documents)
        .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
        .returning({ id: schema.documents.id });
      if (!doc) return json({ error: 'Not found' }, 404);
      return json({ ok: true });
    }

    return json({ error: 'Method not allowed' }, 405);
  } catch (err: any) {
    console.error('Documents API error:', err);
    return json({ error: err.message || 'Internal server error' }, 500);
  }
}
