import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index';
import { getUserId } from '../lib/middleware';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'Document ID required' });

    if (req.method === 'GET') {
        const [doc] = await db.select()
            .from(schema.documents)
            .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
            .limit(1);
        if (!doc) return res.status(404).json({ error: 'Not found' });
        return res.json(doc);
    }

    if (req.method === 'PUT') {
        const { title, status, data, type, icon } = req.body ?? {};
        const updates: Record<string, unknown> = { updatedAt: new Date() };
        if (title !== undefined) updates.title = title;
        if (status !== undefined) updates.status = status;
        if (data !== undefined) updates.data = data;
        if (type !== undefined) updates.type = type;
        if (icon !== undefined) updates.icon = icon;

        const [doc] = await db.update(schema.documents)
            .set(updates)
            .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
            .returning();
        if (!doc) return res.status(404).json({ error: 'Not found' });
        return res.json(doc);
    }

    if (req.method === 'DELETE') {
        const [doc] = await db.delete(schema.documents)
            .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
            .returning({ id: schema.documents.id });
        if (!doc) return res.status(404).json({ error: 'Not found' });
        return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
