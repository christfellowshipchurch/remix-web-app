import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import type { ReactNode } from "react";

import { Navbar, Footer } from "./components";
import { AuthProvider } from "./providers/auth-provider";
import { CookieConsentProvider } from "./providers/cookie-consent-provider";

import "./styles/tailwind.css";
import { cn } from "./lib/utils";
import { shouldUseDarkMode } from "./components/navbar/navbar-routes";

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
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <AuthProvider>
      <CookieConsentProvider>
        <div className="min-h-screen flex flex-col">
          {/* TODO: Fix navbar errors being logged in the console */}
          <Navbar />
          <main
            className={cn(
              "flex-1",
              shouldUseDarkMode(currentPath) && "mt-[-100px]" // This is to account for the navbar height when dark mode is enabled
            )}
          >
            <Outlet />
          </main>
          <Footer />
        </div>
      </CookieConsentProvider>
    </AuthProvider>
  );
}
