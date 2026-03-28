import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../db/index';
import { signToken } from '../lib/auth';
import { eq } from 'drizzle-orm';

interface GoogleTokenResponse {
    access_token: string;
    id_token: string;
    token_type: string;
}

interface GoogleUserInfo {
    sub: string;
    email: string;
    name: string;
    picture: string;
    email_verified: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const { code } = req.query;
        if (!code || typeof code !== 'string') {
            return res.redirect(302, '/login?error=no_code');
        }

        const clientId = process.env.GOOGLE_CLIENT_ID!;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
        const host = req.headers.host || 'readylegacy.ch';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const redirectUri = `${protocol}://${host}/api/auth/google-callback`;

        // Exchange code for tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenRes.ok) {
            const err = await tokenRes.text();
            console.error('Google token exchange failed:', err);
            return res.redirect(302, '/login?error=token_exchange');
        }

        const tokens: GoogleTokenResponse = await tokenRes.json();

        // Get user info
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        if (!userInfoRes.ok) {
            return res.redirect(302, '/login?error=user_info');
        }

        const googleUser: GoogleUserInfo = await userInfoRes.json();
        if (!googleUser.email) {
            return res.redirect(302, '/login?error=no_email');
        }

        // Find or create user
        let [user] = await db.select()
            .from(schema.users)
            .where(eq(schema.users.email, googleUser.email.toLowerCase()))
            .limit(1);

        if (!user) {
            [user] = await db.insert(schema.users).values({
                email: googleUser.email.toLowerCase(),
                passwordHash: '',
                name: googleUser.name || googleUser.email.split('@')[0],
                provider: 'google',
                plan: 'free',
            }).returning();
        }

        // Issue JWT
        const token = await signToken({ userId: user.id, email: user.email });

        const userData = JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
            provider: user.provider,
        });

        // Redirect with inline script that stores token and redirects
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`<!DOCTYPE html>
<html><head><title>Logging in...</title></head>
<body>
<p>Logging in...</p>
<script>
localStorage.setItem('readylegacy_token', ${JSON.stringify(token)});
localStorage.setItem('readylegacy_user', ${JSON.stringify(userData)});
window.location.href = '/profile';
</script>
</body></html>`);
    } catch (err: any) {
        console.error('Google OAuth error:', err);
        res.redirect(302, '/login?error=server_error');
    }
}
