import { getDb, schema } from '../_lib/db';
import { signToken } from '../_lib/auth';
import { logAudit, getRequestMeta } from '../_lib/audit';
import type { CFContext } from '../_lib/types';
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

export async function onRequest(context: CFContext): Promise<Response> {
  const url = new URL(context.request.url);

  try {
    const code = url.searchParams.get('code');
    if (!code) {
      return Response.redirect(`${url.origin}/login?error=no_code`, 302);
    }

    const clientId = context.env.GOOGLE_CLIENT_ID;
    const clientSecret = context.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${url.origin}/api/auth/google-callback`;

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
      console.error('Google token exchange failed:', await tokenRes.text());
      return Response.redirect(`${url.origin}/login?error=token_exchange`, 302);
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    // Get user info
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) {
      return Response.redirect(`${url.origin}/login?error=user_info`, 302);
    }

    const googleUser: GoogleUserInfo = await userInfoRes.json();
    if (!googleUser.email) {
      return Response.redirect(`${url.origin}/login?error=no_email`, 302);
    }

    // Find or create user
    const db = getDb(context.env.DATABASE_URL);
    let [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, googleUser.email.toLowerCase()))
      .limit(1);

    if (!user) {
      [user] = await db
        .insert(schema.users)
        .values({
          email: googleUser.email.toLowerCase(),
          passwordHash: '',
          name: googleUser.name || googleUser.email.split('@')[0],
          provider: 'google',
          plan: 'free',
        })
        .returning();
    }

    const meta = getRequestMeta(context.request);
    context.waitUntil(logAudit(context.env.DATABASE_URL, { userId: user.id, action: 'login_success', resource: 'auth', details: { provider: 'google' }, ...meta }));

    // Issue JWT
    const token = await signToken(
      { userId: user.id, email: user.email },
      context.env.JWT_SECRET,
    );

    const userData = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      provider: user.provider,
      picture: googleUser.picture || '',
    });

    return new Response(
      `<!DOCTYPE html>
<html><head><title>Logging in...</title></head>
<body>
<p>Logging in...</p>
<script>
localStorage.setItem('readylegacy_token', ${JSON.stringify(token)});
localStorage.setItem('readylegacy_user', ${JSON.stringify(userData)});
window.location.href = '/profile';
</script>
</body></html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      },
    );
  } catch (err: any) {
    console.error('Google OAuth error:', err);
    return Response.redirect(`${url.origin}/login?error=server_error`, 302);
  }
}
