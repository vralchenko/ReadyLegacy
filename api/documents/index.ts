import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index';
import { getUserId } from '../lib/middleware';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        const docs = await db.select()
            .from(schema.documents)
            .where(eq(schema.documents.userId, userId))
            .orderBy(desc(schema.documents.createdAt));
        return res.json(docs);
    }

    if (req.method === 'POST') {
        const { title, type, icon, data } = req.body ?? {};
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const [doc] = await db.insert(schema.documents).values({
            userId,
            title,
            type: type || '',
            icon: icon || '📄',
            data: data || {},
        }).returning();
        return res.status(201).json(doc);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
