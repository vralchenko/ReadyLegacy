import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export async function signToken(
  payload: { userId: string; email: string },
  secret: string,
): Promise<string> {
  const key = new TextEncoder().encode(secret);
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(key);
}

export async function verifyToken(
  token: string,
  secret: string,
): Promise<{ userId: string; email: string } | null> {
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 8);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
