import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index';
import { verifyPassword, signToken } from '../lib/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, password } = req.body ?? {};
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const [user] = await db.select()
        .from(schema.users)
        .where(eq(schema.users.email, email.toLowerCase()))
        .limit(1);

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.passwordHash) {
        return res.status(401).json({ error: 'This account uses Google sign-in. Please use the Google button.' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = await signToken({ userId: user.id, email: user.email });
    return res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
            provider: user.provider,
        },
    });
}
