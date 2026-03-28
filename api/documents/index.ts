import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index';
import { getUserId } from '../lib/middleware';
import { eq, and, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const id = req.query.id as string | undefined;

        // GET /api/documents — list all
        if (req.method === 'GET' && !id) {
            const docs = await db.select()
                .from(schema.documents)
                .where(eq(schema.documents.userId, userId))
                .orderBy(desc(schema.documents.createdAt));
            return res.json(docs);
        }

        // GET /api/documents?id=xxx — single doc
        if (req.method === 'GET' && id) {
            const [doc] = await db.select()
                .from(schema.documents)
                .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
                .limit(1);
            if (!doc) return res.status(404).json({ error: 'Not found' });
            return res.json(doc);
        }

        // POST /api/documents — create
        if (req.method === 'POST') {
            const { title, type, icon, data } = req.body ?? {};
            if (!title) return res.status(400).json({ error: 'Title is required' });
            const [doc] = await db.insert(schema.documents).values({
                userId, title, type: type || '', icon: icon || '📄', data: data || {},
            }).returning();
            return res.status(201).json(doc);
        }

        // PUT /api/documents?id=xxx — update
        if (req.method === 'PUT' && id) {
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

        // DELETE /api/documents?id=xxx — delete
        if (req.method === 'DELETE' && id) {
            const [doc] = await db.delete(schema.documents)
                .where(and(eq(schema.documents.id, id), eq(schema.documents.userId, userId)))
                .returning({ id: schema.documents.id });
            if (!doc) return res.status(404).json({ error: 'Not found' });
            return res.json({ ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('Documents API error:', err);
        return res.status(500).json({ error: err.message || 'Internal server error' });
    }
}
