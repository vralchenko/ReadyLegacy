import { getDb, schema } from '../../_lib/db';
import { getUserId } from '../../_lib/middleware';
import { json } from '../../_lib/types';
import type { CFContext } from '../../_lib/types';
import { eq, and } from 'drizzle-orm';
import { verifyCode } from '../../_lib/totp';
import { logAudit, getRequestMeta } from '../../_lib/audit';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const { code } = (await context.request.json()) as { code?: string };
  if (!code) {
    return json({ error: 'Code is required to disable MFA' }, 400);
  }

  const db = getDb(context.env.DATABASE_URL);

  // Get MFA secret
  const [mfaSecret] = await db
    .select()
    .from(schema.userData)
    .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, '_mfa_secret')))
    .limit(1);

  if (!mfaSecret) {
    return json({ error: 'MFA is not enabled' }, 400);
  }

  if (!verifyCode(mfaSecret.value as string, code)) {
    return json({ error: 'Invalid code' }, 401);
  }

  const meta = getRequestMeta(context.request);

  // Remove all MFA data
  const deleteKey = (key: string) =>
    db.delete(schema.userData)
      .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, key)));

  await Promise.all([
    deleteKey('_mfa_secret'),
    deleteKey('_mfa_enabled'),
    deleteKey('_mfa_backup_codes'),
    deleteKey('_mfa_pending_setup'),
  ]);

  context.waitUntil(logAudit(context.env.DATABASE_URL, { userId, action: 'mfa_disabled', resource: 'auth', ...meta }));

  return json({ ok: true });
}
