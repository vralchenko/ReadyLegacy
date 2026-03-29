import { getDb, schema } from '../_lib/db';
import { getUserId } from '../_lib/middleware';
import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const { items } = (await context.request.json()) as any;
  if (!Array.isArray(items) || items.length === 0) {
    return json({ error: 'Items array is required' }, 400);
  }

  const db = getDb(context.env.DATABASE_URL);
  let synced = 0;
  for (const item of items) {
    if (!item.key) continue;
    await db
      .insert(schema.userData)
      .values({ userId, key: item.key, value: item.value ?? null, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [schema.userData.userId, schema.userData.key],
        set: { value: item.value ?? null, updatedAt: new Date() },
      });
    synced++;
  }

  return json({ synced });
}
