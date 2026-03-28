import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index';
import { hashPassword, signToken } from '../lib/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, password, name } = req.body ?? {};
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await db.select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.email, email.toLowerCase()))
        .limit(1);

    if (existing.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(schema.users).values({
        email: email.toLowerCase(),
        passwordHash,
        name,
        provider: 'email',
        plan: 'free',
    }).returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        plan: schema.users.plan,
        provider: schema.users.provider,
    });

    const token = await signToken({ userId: user.id, email: user.email });
    return res.status(201).json({ token, user });
}
