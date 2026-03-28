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
        const redirectUri = `${process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL
            : process.env.NEXT_PUBLIC_URL || 'https://readylegacy.ch'}/api/auth/google-callback`;

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
            // Create new user (no password needed for OAuth)
            [user] = await db.insert(schema.users).values({
                email: googleUser.email.toLowerCase(),
                passwordHash: '', // OAuth users have no password
                name: googleUser.name || googleUser.email.split('@')[0],
                provider: 'google',
                plan: 'free',
            }).returning();
        }

        // Issue JWT
        const token = await signToken({ userId: user.id, email: user.email });

        // Redirect to frontend with token
        res.redirect(302, `/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
            provider: user.provider,
        }))}`);
    } catch (err: any) {
        console.error('Google OAuth error:', err);
        res.redirect(302, '/login?error=server_error');
    }
}
