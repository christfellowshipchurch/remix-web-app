import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { ReactNode } from "react";

import { Navbar, Footer } from "./components";
import { AuthProvider } from "./providers/auth-provider";
import { CookieConsentProvider } from "./providers/cookie-consent-provider";

import "./styles/tailwind.css";

export { ErrorBoundary } from "./error";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
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
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </CookieConsentProvider>
    </AuthProvider>
  );
}
