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
  if (!code || code.length !== 6) {
    return json({ error: 'A valid 6-digit code is required' }, 400);
  }

  const db = getDb(context.env.DATABASE_URL);

  // Get pending setup
  const [pending] = await db
    .select()
    .from(schema.userData)
    .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, '_mfa_pending_setup')))
    .limit(1);

  if (!pending) {
    return json({ error: 'No MFA setup in progress. Start setup first.' }, 400);
  }

  const { secret, createdAt } = pending.value as { secret: string; createdAt: number };

  // Check 10-minute TTL
  if (Date.now() - createdAt > 10 * 60 * 1000) {
    await db.delete(schema.userData)
      .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, '_mfa_pending_setup')));
    return json({ error: 'Setup expired. Please start again.' }, 400);
  }

  // Verify TOTP code
  if (!verifyCode(secret, code)) {
    return json({ error: 'Invalid code. Please try again.' }, 400);
  }

  const backupCodes = generateBackupCodes();
  const meta = getRequestMeta(context.request);

  // Store MFA secret, enabled flag, and backup codes in parallel
  const upsert = (key: string, value: unknown) =>
    db.insert(schema.userData)
      .values({ userId, key, value: value as any })
      .onConflictDoUpdate({
        target: [schema.userData.userId, schema.userData.key],
        set: { value: value as any, updatedAt: new Date() },
      });

  await Promise.all([
    upsert('_mfa_secret', secret),
    upsert('_mfa_enabled', true),
    upsert('_mfa_backup_codes', backupCodes),
    // Delete pending setup
    db.delete(schema.userData)
      .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, '_mfa_pending_setup'))),
  ]);

  context.waitUntil(logAudit(context.env.DATABASE_URL, { userId, action: 'mfa_enabled', resource: 'auth', ...meta }));

  return json({ ok: true, backupCodes });
}
