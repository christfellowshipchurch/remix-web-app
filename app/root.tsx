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

export { ErrorBoundary } from "./error";

export { loader }; // root loader currently being used for the navbar data

export function Layout({ children }: { children: ReactNode }) {
  const gtmId = import.meta.env.VITE_GTM_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Consent Mode v2 - Default to denied */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied'
              });`,
            }}
          />
        )}
        {/* GTM Script */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
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
