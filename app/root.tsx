import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  useRouteLoaderData,
} from "react-router-dom";
import { type ReactNode } from "react";
import { type LoaderFunctionArgs } from "react-router-dom";
import { randomUUID } from "node:crypto";

import { Navbar, Footer } from "./components";
import { AuthProvider } from "./providers/auth-provider";
import { CookieConsentProvider } from "./providers/cookie-consent-provider";

import "./styles/tailwind.css";
import { loader as navbarLoader } from "./routes/navbar/loader";
import { NavbarVisibilityProvider } from "./providers/navbar-visibility-context";
import { DeferredGtm } from "./components/deferred-gtm";
import { setupDevWebVitalsLogging } from "~/lib/dev-web-vitals";

export { ErrorBoundary } from "./error";

// Runs only in the browser (setup no-ops without window). Avoid import.meta.env.SSR here—
// client bundles can still evaluate oddly; window check inside setup is authoritative.
setupDevWebVitalsLogging();

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://fast.wistia.com https://fast.wistia.net`,
    "style-src 'self' 'unsafe-inline' https://fast.wistia.com",
    "img-src 'self' data: https: blob:",
    // Algolia search & related APIs: https://support.algolia.com/hc/en-us/articles/8947249849873
    "connect-src 'self' https://*.algolia.net https://*.algolianet.com https://*.algolia.io",
    "frame-src https://www.googletagmanager.com https://fast.wistia.com",
    "frame-ancestors 'none'",
  ].join("; ");
}

export async function loader(args: LoaderFunctionArgs) {
  const nonce = randomUUID();
  const navbarData = await navbarLoader(args);
  return data(
    { ...navbarData, nonce },
    { headers: { "Content-Security-Policy": buildCsp(nonce) } },
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>("root");
  const nonce = loaderData?.nonce;
  const gtmId = import.meta.env.VITE_GTM_ID;

  return (
    <html lang="en">
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      {/* suppressHydrationWarning: extensions (e.g. ColorZilla) inject attrs like cz-shortcut-listen on <body> */}
      <body suppressHydrationWarning>
        {/* GTM Noscript (Fallback) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {gtmId ? <DeferredGtm gtmId={gtmId} /> : null}
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
          <div className="min-h-screen flex flex-col text-pretty">
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
