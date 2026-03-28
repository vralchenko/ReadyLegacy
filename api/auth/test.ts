import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const results: Record<string, string> = {};

    try { require('drizzle-orm'); results['drizzle-orm'] = 'ok'; } catch (e: any) { results['drizzle-orm'] = e.message; }
    try { require('drizzle-orm/pg-core'); results['drizzle-orm/pg-core'] = 'ok'; } catch (e: any) { results['drizzle-orm/pg-core'] = e.message; }
    try { require('drizzle-orm/neon-http'); results['drizzle-orm/neon-http'] = 'ok'; } catch (e: any) { results['drizzle-orm/neon-http'] = e.message; }
    try { require('@neondatabase/serverless'); results['@neondatabase/serverless'] = 'ok'; } catch (e: any) { results['@neondatabase/serverless'] = e.message; }
    try { require('jose'); results['jose'] = 'ok'; } catch (e: any) { results['jose'] = e.message; }
    try { require('bcryptjs'); results['bcryptjs'] = 'ok'; } catch (e: any) { results['bcryptjs'] = e.message; }

    results['DATABASE_URL'] = process.env.DATABASE_URL ? 'set' : 'missing';
    results['JWT_SECRET'] = process.env.JWT_SECRET ? 'set' : 'missing';

    return res.json(results);
}
