import { getDb, schema } from '../../_lib/db';
import { signToken, verifyToken } from '../../_lib/auth';
import { json } from '../../_lib/types';
import type { CFContext } from '../../_lib/types';
import { eq, and } from 'drizzle-orm';
import { verifyCode } from '../../_lib/totp';
import { logAudit, getRequestMeta } from '../../_lib/audit';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const { challengeToken, code } = (await context.request.json()) as { challengeToken?: string; code?: string };
  if (!challengeToken || !code) {
    return json({ error: 'Challenge token and code are required' }, 400);
  }

  // Verify challenge token
  const key = new TextEncoder().encode(context.env.JWT_SECRET);
  let payload: { userId: string; email: string; mfaChallenge?: boolean } | null = null;
  try {
    const { payload: p } = await (await import('jose')).jwtVerify(challengeToken, key);
    payload = p as unknown as { userId: string; email: string; mfaChallenge?: boolean };
  } catch {
    return json({ error: 'Invalid or expired challenge token' }, 401);
  }

  if (!payload?.mfaChallenge || !payload.userId) {
    return json({ error: 'Invalid challenge token' }, 401);
  }

  const meta = getRequestMeta(context.request);
  const db = getDb(context.env.DATABASE_URL);

  // Get MFA secret
  const [mfaSecret] = await db
    .select()
    .from(schema.userData)
    .where(and(eq(schema.userData.userId, payload.userId), eq(schema.userData.key, '_mfa_secret')))
    .limit(1);

  if (!mfaSecret) {
    return json({ error: 'MFA not configured' }, 400);
  }

  const secret = mfaSecret.value as string;

  // Try TOTP code first
  if (verifyCode(secret, code)) {
    const token = await signToken({ userId: payload.userId, email: payload.email }, context.env.JWT_SECRET);
    const [user] = await db
      .select({ id: schema.users.id, email: schema.users.email, name: schema.users.name, plan: schema.users.plan, provider: schema.users.provider })
      .from(schema.users)
      .where(eq(schema.users.id, payload.userId))
      .limit(1);

    context.waitUntil(logAudit(context.env.DATABASE_URL, { userId: payload.userId, action: 'mfa_verify_success', resource: 'auth', ...meta }));
    return json({ token, user });
  }

  // Try backup code
  const [backupRow] = await db
    .select()
    .from(schema.userData)
    .where(and(eq(schema.userData.userId, payload.userId), eq(schema.userData.key, '_mfa_backup_codes')))
    .limit(1);

  if (backupRow) {
    const codes = backupRow.value as string[];
    const idx = codes.indexOf(code);
    if (idx !== -1) {
      // Remove used backup code
      const remaining = codes.filter((_, i) => i !== idx);
      await db.insert(schema.userData)
        .values({ userId: payload.userId, key: '_mfa_backup_codes', value: remaining as any })
        .onConflictDoUpdate({
          target: [schema.userData.userId, schema.userData.key],
          set: { value: remaining as any, updatedAt: new Date() },
        });

      const token = await signToken({ userId: payload.userId, email: payload.email }, context.env.JWT_SECRET);
      const [user] = await db
        .select({ id: schema.users.id, email: schema.users.email, name: schema.users.name, plan: schema.users.plan, provider: schema.users.provider })
        .from(schema.users)
        .where(eq(schema.users.id, payload.userId))
        .limit(1);

      context.waitUntil(logAudit(context.env.DATABASE_URL, { userId: payload.userId, action: 'mfa_backup_code_used', resource: 'auth', details: { remaining: remaining.length }, ...meta }));
      return json({ token, user });
    }
  }

  context.waitUntil(logAudit(context.env.DATABASE_URL, { userId: payload.userId, action: 'mfa_verify_failed', resource: 'auth', ...meta }));
  return json({ error: 'Invalid code' }, 401);
}
