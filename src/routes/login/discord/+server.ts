import { generateState } from 'arctic';
import { discord } from '$lib/server/oauth';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
  const state = generateState();
  const scopes = ['identify'];
  const url = discord.createAuthorizationURL(state, null, scopes);

  event.cookies.set('discord_oauth_state', state, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
