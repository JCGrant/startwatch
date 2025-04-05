import * as auth from '$lib/server/auth.js';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(auth.sessionCookieName);
  if (!sessionToken) {
    return redirectToLogin(event, resolve);
  }

  const { session, user } = await auth.validateSessionToken(sessionToken);

  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    auth.deleteSessionTokenCookie(event);
  }
  if (!session || !user) {
    return redirectToLogin(event, resolve);
  }

  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};

const publicRoutes = ['/login', '/login/discord', '/api/auth/callback/discord'];

const redirectToLogin = (
  event: RequestEvent,
  resolve: (event: RequestEvent) => Response | Promise<Response>,
) => {
  if (publicRoutes.includes(event.url.pathname)) {
    return resolve(event);
  }
  return redirect(302, `/login`);
};

export const handle: Handle = handleAuth;
