import { getDb, schema } from '../_lib/db';
import { getUserId } from '../_lib/middleware';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';
import { eq, and } from 'drizzle-orm';

export async function onRequest(context: CFContext): Promise<Response> {
  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const db = getDb(context.env.DATABASE_URL);
  const method = context.request.method;

  if (method === 'GET') {
    const url = new URL(context.request.url);
    const key = url.searchParams.get('key');
    if (!key) return json({ error: 'Key parameter is required' }, 400);

    const [row] = await db
      .select({ key: schema.userData.key, value: schema.userData.value })
      .from(schema.userData)
      .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, key)))
      .limit(1);

    if (!row) return json({ key, value: null });
    return json(row);
  }

  if (method === 'PUT') {
    const { key, value } = (await context.request.json()) as any;
    if (!key) return json({ error: 'Key is required' }, 400);

    await db
      .insert(schema.userData)
      .values({ userId, key, value: value ?? null, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [schema.userData.userId, schema.userData.key],
        set: { value: value ?? null, updatedAt: new Date() },
      });

    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
