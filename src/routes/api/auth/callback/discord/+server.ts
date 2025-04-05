import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { discord } from '$lib/server/oauth';
import * as table from '$lib/server/db/schema';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { eq } from 'drizzle-orm';

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');
  const storedState = event.cookies.get('discord_oauth_state') ?? null;

  if (code === null || state === null || storedState === null) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await discord.validateAuthorizationCode(code, null);
  } catch {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }

  const accessToken = tokens.accessToken();
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const discordUser = await response.json();

  const [existingUser] = await db
    .select()
    .from(table.user)
    .where(eq(table.user.discordId, discordUser.id));

  if (existingUser) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  }

  const [user] = await db
    .insert(table.user)
    .values({
      discordId: discordUser.id,
      username: discordUser.username,
    })
    .returning();

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  });
}
