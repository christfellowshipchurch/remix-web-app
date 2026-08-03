/**
 * TEMP — throwaway login page for local/spike auth testing.
 *
 * `requireUser` redirects here (`/login`). Production nav still points at the
 * external groups app; do not ship this as the real login UX.
 */
import { Link, useSearchParams } from 'react-router';
import { AuthModal } from '~/components';
import { Button } from '~/primitives/button/button.primitive';
import { useAuth } from '~/providers/auth-provider';

export default function TempLoginPage() {
  const { user, isLoading, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const safeReturnTo =
    returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : null;

  return (
    <div style={{ padding: 16, fontFamily: 'monospace', paddingTop: 96 }}>
      <h1>TEMP: login</h1>
      <p>Uses AuthModal against /auth. Not production UI.</p>

      {isLoading ? (
        <p>Checking session…</p>
      ) : user ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p>
            Logged in as {user.fullName || user.email || user.id}
            {user.email ? ` (${user.email})` : ''}
          </p>
          {safeReturnTo ? (
            <p>
              Continue to <Link to={safeReturnTo}>{safeReturnTo}</Link>
            </p>
          ) : null}
          <Button onClick={logout}>Logout</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p>Not logged in.</p>
          {safeReturnTo ? (
            <p>After login → {safeReturnTo}</p>
          ) : null}
          <AuthModal
            buttonStyle='underline font-semibold cursor-pointer'
            buttonText='Open AuthModal'
          />
        </div>
      )}
    </div>
  );
}
