import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const getSecret = () => process.env.JWT_SECRET!;

export async function signToken(payload: { userId: string; email: string }): Promise<string> {
    return jwt.sign(payload, getSecret(), { expiresIn: '30d' });
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
    try {
        const payload = jwt.verify(token, getSecret()) as { userId: string; email: string };
        return payload;
    } catch {
        return null;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
