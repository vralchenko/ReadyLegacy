import { verifyToken } from './auth';

export async function getUserId(request: Request, jwtSecret: string): Promise<string | null> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const payload = await verifyToken(token, jwtSecret);
  return payload?.userId ?? null;
}
