import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index.js';
import { getUserId } from '../lib/middleware.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        const key = req.query.key as string;
        if (!key) return res.status(400).json({ error: 'Key parameter is required' });

        const [row] = await db.select({ key: schema.userData.key, value: schema.userData.value })
            .from(schema.userData)
            .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, key)))
            .limit(1);

        if (!row) return res.json({ key, value: null });
        return res.json(row);
    }

    if (req.method === 'PUT') {
        const { key, value } = req.body ?? {};
        if (!key) return res.status(400).json({ error: 'Key is required' });

        await db.insert(schema.userData)
            .values({ userId, key, value: value ?? null, updatedAt: new Date() })
            .onConflictDoUpdate({
                target: [schema.userData.userId, schema.userData.key],
                set: { value: value ?? null, updatedAt: new Date() },
            });

        return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
