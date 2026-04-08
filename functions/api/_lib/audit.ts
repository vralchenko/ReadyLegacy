import { getDb, schema } from './db';

export interface AuditEntry {
  userId?: string | null;
  action: string;
  resource?: string;
  resourceId?: string;
  ip?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown>;
}

export async function logAudit(dbUrl: string, entry: AuditEntry): Promise<void> {
  try {
    const db = getDb(dbUrl);
    await db.insert(schema.auditLogs).values({
      userId: entry.userId || null,
      action: entry.action,
      resource: entry.resource || null,
      resourceId: entry.resourceId || null,
      ip: entry.ip || null,
      userAgent: entry.userAgent?.slice(0, 500) || null,
      details: entry.details || null,
    });
  } catch (err) {
    // Audit logging should never break the main request
    console.error('Audit log error:', err);
  }
}

export function getRequestMeta(request: Request) {
  return {
    ip: request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || null,
    userAgent: request.headers.get('user-agent') || null,
  };
}
