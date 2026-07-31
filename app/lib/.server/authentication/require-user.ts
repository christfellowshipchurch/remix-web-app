/**
 * Server-side auth gates for authenticated routes.
 *
 * `getAuthContext` resolves the caller; `requireUser` insists on one. Both are
 * deliberately separate from the existing `getUserFromRequest` / `currentUser`
 * pair, which returns four different shapes and — on an *expired* token —
 * returns a `data()` object rather than a `Response`, so callers render a broken
 * authed page instead of redirecting (auth-review C6).
 *
 * Here an expired token is indistinguishable from an absent one: both mean "no
 * caller", both produce `null`, and `requireUser` turns that into a redirect.
 */
import { redirect } from 'react-router';
import { AUTH_TOKEN_KEY } from '~/providers/auth-provider';
import { decrypt } from '../decrypt';
import { registerToken } from '../token';
import { getCurrentPerson } from './rock-authentication';

export interface AuthContext {
  personId: number;
  primaryAliasId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  /** SERVER-ONLY: decrypted Rock forms-auth cookie. Never send to the client. */
  rockCookie: string;
  sessionId: string;
}

/**
 * Resolves the caller from the request's `auth-token` cookie.
 *
 * NEVER throws for an auth failure — a missing, malformed, or expired token all
 * return `null`. One uncached Rock call (`People/GetCurrentPerson`) on the happy
 * path; that read runs *as the user*, not as the service account, because
 * `getCurrentPerson` suppresses the default `Authorization-Token`.
 */
export const getAuthContext = async (
  request: Request,
): Promise<AuthContext | null> => {
  const token = request.headers
    .get('Cookie')
    ?.match(new RegExp(`${AUTH_TOKEN_KEY}=([^;]+)`))?.[1];

  if (!token) return null;

  try {
    // `registerToken` returns {} for an expired JWT and throws for a malformed
    // one; both collapse to "no caller" here.
    const { rockCookie, sessionId } = registerToken(decrypt(token));
    if (!rockCookie || !sessionId) return null;

    const person = await getCurrentPerson(rockCookie);
    if (!person?.id || !person?.primaryAliasId) return null;

    return {
      personId: person.id,
      primaryAliasId: person.primaryAliasId,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      rockCookie,
      sessionId,
    };
  } catch {
    return null;
  }
};

/**
 * Requires an authenticated caller. Returns the context or THROWS a redirect,
 * so callers can treat the return value as always present.
 *
 * @param options.loginPath - where to send an unauthenticated caller
 * @param options.returnTo - append `?returnTo=<current path>` to the login URL
 */
export const requireUser = async (
  request: Request,
  options?: { loginPath?: string; returnTo?: boolean },
): Promise<AuthContext> => {
  const auth = await getAuthContext(request);
  if (auth) return auth;

  const loginPath = options?.loginPath ?? '/login';

  if (options?.returnTo) {
    const { pathname, search } = new URL(request.url);
    throw redirect(
      `${loginPath}?returnTo=${encodeURIComponent(`${pathname}${search}`)}`,
    );
  }

  throw redirect(loginPath);
};
