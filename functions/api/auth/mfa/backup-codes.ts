import { getDb, schema } from '../../_lib/db';
import { getUserId } from '../../_lib/middleware';
import { json } from '../../_lib/types';
import type { CFContext } from '../../_lib/types';
import { eq, and } from 'drizzle-orm';
import { verifyCode, generateBackupCodes } from '../../_lib/totp';
import { logAudit, getRequestMeta } from '../../_lib/audit';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const { code } = (await context.request.json()) as { code?: string };
  if (!code) {
    return json({ error: 'Current TOTP code is required' }, 400);
  }

  const db = getDb(context.env.DATABASE_URL);

  // Verify MFA is enabled and code is valid
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

  const newCodes = generateBackupCodes();
  const meta = getRequestMeta(context.request);

  await db.insert(schema.userData)
    .values({ userId, key: '_mfa_backup_codes', value: newCodes as any })
    .onConflictDoUpdate({
      target: [schema.userData.userId, schema.userData.key],
      set: { value: newCodes as any, updatedAt: new Date() },
    });

  context.waitUntil(logAudit(context.env.DATABASE_URL, { userId, action: 'mfa_backup_codes_regenerated', resource: 'auth', ...meta }));

  return json({ backupCodes: newCodes });
}
