import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return res.status(500).json({ error: 'Google OAuth not configured' });

    const redirectUri = `${process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL
        : process.env.NEXT_PUBLIC_URL || 'https://readylegacy.ch'}/api/auth/google-callback`;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account',
    });

    res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
