import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index.js';
import { getUserId } from '../lib/middleware.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { items } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items array is required' });
    }

    let synced = 0;
    for (const item of items) {
        if (!item.key) continue;
        await db.insert(schema.userData)
            .values({ userId, key: item.key, value: item.value ?? null, updatedAt: new Date() })
            .onConflictDoUpdate({
                target: [schema.userData.userId, schema.userData.key],
                set: { value: item.value ?? null, updatedAt: new Date() },
            });
        synced++;
    }

    return res.json({ synced });
}
