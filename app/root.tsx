import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";
import { type ReactNode } from "react";

import { Navbar, Footer } from "./components";
import { AuthProvider } from "./providers/auth-provider";
import { CookieConsentProvider } from "./providers/cookie-consent-provider";
import { GTMProvider } from "./providers/gtm-provider";

import "./styles/tailwind.css";
import { cn } from "./lib/utils";
import { shouldUseDarkMode } from "./components/navbar/navbar-routes";
import { loader } from "./routes/navbar/loader";
import { NavbarVisibilityProvider } from "./providers/navbar-visibility-context";

export { ErrorBoundary } from "./error";

export { loader }; // root loader currently being used for the navbar data

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
    <GTMProvider gtmId="GTM-PFW26V4V">
      <AuthProvider>
        <CookieConsentProvider>
          <NavbarVisibilityProvider>
            <div className="min-h-screen flex flex-col text-pretty">
              <Navbar />
              <main
                className={cn(
                  "flex-1",
                  `lg:${shouldUseDarkMode(currentPath) && "mt-[-100px]"} ${
                    shouldUseDarkMode(currentPath) && "mt-[-100px]"
                  }` // This is to account for the navbar height when dark mode is enabled
                )}
              >
                {/* Remove only on the home page, since the navbar has an Outlet for the home page there*/}
                {currentPath !== "/" && <Outlet />}
              </main>
              <Footer />
            </div>
          </NavbarVisibilityProvider>
        </CookieConsentProvider>
      </AuthProvider>
    </GTMProvider>
  );
}
