import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index';
import { getUserId } from '../lib/middleware';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const [user] = await db.select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        plan: schema.users.plan,
        provider: schema.users.provider,
    })
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1);

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ user });
}
