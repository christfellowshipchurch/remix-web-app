import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router-dom";
import { type ReactNode } from "react";

import { Navbar, Footer } from "./components";
import { AuthProvider } from "./providers/auth-provider";
import { CookieConsentProvider } from "./providers/cookie-consent-provider";

import "./styles/tailwind.css";
import { loader } from "./routes/navbar/loader";
import { NavbarVisibilityProvider } from "./providers/navbar-visibility-context";
import { DeferredGtm } from "./components/deferred-gtm";

export { ErrorBoundary } from "./error";

export { loader }; // root loader currently being used for the navbar data

export function Layout({ children }: { children: ReactNode }) {
  const gtmId = import.meta.env.VITE_GTM_ID;

  return (
    <html lang="en">
      <head>
        {/* 1. CONSENT DEFAULT (Must be first) */}
        <script
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
      <body>
        {/* GTM Noscript (Fallback) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {gtmId ? <DeferredGtm gtmId={gtmId} /> : null}
        {children}
        <ScrollRestoration />
        <Scripts />
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
