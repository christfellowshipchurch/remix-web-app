import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  useRouteLoaderData,
} from 'react-router-dom';
import { type ReactNode } from 'react';
import {
  type HeadersFunction,
  type LoaderFunctionArgs,
} from 'react-router-dom';
import { randomUUID } from 'node:crypto';

import { Navbar, Footer } from './components';
import { AuthProvider } from './providers/auth-provider';
import { CookieConsentProvider } from './providers/cookie-consent-provider';

import './styles/tailwind.css';
import { loader as navbarLoader } from './routes/navbar/loader';
import { NavbarVisibilityProvider } from './providers/navbar-visibility-context';
import { setupDevWebVitalsLogging } from '~/lib/dev-web-vitals';

export { ErrorBoundary } from './error';

// Runs only in the browser (setup no-ops without window). Avoid import.meta.env.SSR here—
// client bundles can still evaluate oddly; window check inside setup is authoritative.
setupDevWebVitalsLogging();

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://*.wistia.com https://*.wistia.net https://www.clarity.ms https://*.clarity.ms`,
    "style-src 'self' 'unsafe-inline' https://fast.wistia.com",
    "img-src 'self' data: https: blob:",
    // Algolia search & related APIs: https://support.algolia.com/hc/en-us/articles/8947249849873
    // Microsoft Clarity sends telemetry to *.clarity.ms and c.bing.com
    // GA4 collection (fetch/sendBeacon) + GTM
    "connect-src 'self' https://*.algolia.net https://*.algolianet.com https://*.algolia.io https://*.clarity.ms https://c.bing.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    'frame-src https://www.googletagmanager.com https://*.wistia.com https://*.wistia.net',
    "frame-ancestors 'none'",
  ].join('; ');
}

export async function loader(args: LoaderFunctionArgs) {
  const nonce = randomUUID();
  const navbarData = await navbarLoader(args);
  return data(
    { ...navbarData, nonce },
    { headers: { 'Content-Security-Policy': buildCsp(nonce) } },
  );
}

// Loader headers from data(..., { headers }) only auto-forward Set-Cookie on
// document responses. Forward CSP explicitly so the nonce'd policy is enforced.
export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const headers = new Headers();
  const csp = loaderHeaders.get('Content-Security-Policy');
  if (csp) {
    headers.set('Content-Security-Policy', csp);
  }
  return headers;
};

export function Layout({ children }: { children: ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>('root');
  const nonce = loaderData?.nonce;

  return (
    <html lang='en'>
      <head>
        {/* 1. CONSENT DEFAULT (Must be first) */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Set default consent to 'denied' immediately
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500 // Gives your React app 500ms to load cached consent
              });
            `,
          }}
        />
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      {/* suppressHydrationWarning: extensions (e.g. ColorZilla) inject attrs like cz-shortcut-listen on <body> */}
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CookieConsentProvider>
        <NavbarVisibilityProvider>
          <div className='min-h-screen flex flex-col text-pretty'>
            <Navbar />
            <main>
              <Outlet />
            </main>
            <Footer />
          </div>
        </NavbarVisibilityProvider>
      </CookieConsentProvider>
    </AuthProvider>
  );
}
