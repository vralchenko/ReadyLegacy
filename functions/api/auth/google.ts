import { json } from '../_lib/types';
import type { CFContext } from '../_lib/types';

export async function onRequest(context: CFContext): Promise<Response> {
  const clientId = context.env.GOOGLE_CLIENT_ID;
  if (!clientId) return json({ error: 'Google OAuth not configured' }, 500);

  const url = new URL(context.request.url);
  const redirectUri = `${url.origin}/api/auth/google-callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });

  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    302,
  );
}
