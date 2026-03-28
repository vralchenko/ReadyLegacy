import type { VercelRequest } from '@vercel/node';
import { verifyToken } from './auth';

export async function getUserId(req: VercelRequest): Promise<string | null> {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    const token = auth.slice(7);
    const payload = await verifyToken(token);
    return payload?.userId ?? null;
}
