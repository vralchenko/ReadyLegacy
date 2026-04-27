import { getDb, schema } from '../../_lib/db';
import { getUserId } from '../../_lib/middleware';
import { json } from '../../_lib/types';
import type { CFContext } from '../../_lib/types';
import { eq, and } from 'drizzle-orm';

export async function onRequest(context: CFContext): Promise<Response> {
  if (context.request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(context.request, context.env.JWT_SECRET);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const db = getDb(context.env.DATABASE_URL);

  const [row] = await db
    .select()
    .from(schema.userData)
    .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, '_mfa_enabled')))
    .limit(1);

  const enabled = row ? (row.value as boolean) === true : false;

  // Count remaining backup codes
  let backupCodesRemaining = 0;
  if (enabled) {
    const [backupRow] = await db
      .select()
      .from(schema.userData)
      .where(and(eq(schema.userData.userId, userId), eq(schema.userData.key, '_mfa_backup_codes')))
      .limit(1);
    if (backupRow) {
      backupCodesRemaining = (backupRow.value as string[]).length;
    }
  }

  return json({ enabled, backupCodesRemaining });
}
