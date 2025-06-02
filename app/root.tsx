import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";
import { useEffect, useState, type ReactNode } from "react";

import { Navbar, Footer } from "./components";
import { AuthProvider } from "./providers/auth-provider";
import { CookieConsentProvider } from "./providers/cookie-consent-provider";

import "./styles/tailwind.css";
import { cn } from "./lib/utils";
import { shouldUseDarkMode } from "./components/navbar/navbar-routes";
import { SiteBanner } from "./components/site-banner";
import { loader } from "./routes/navbar/loader";

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
  const [showSiteBanner, setShowSiteBanner] = useState<boolean>(false);
  const { siteBanner } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (siteBanner) {
      setShowSiteBanner(true);
    }
  }, [siteBanner]);

  return (
    <AuthProvider>
      <CookieConsentProvider>
        <div className="min-h-screen flex flex-col">
          <div className={cn(showSiteBanner ? "block" : "hidden")}>
            <SiteBanner
              content={siteBanner.content}
              onClose={() => setShowSiteBanner(false)}
            />
          </div>
          <Navbar />
          <main
            className={cn(
              "flex-1",
              `lg:${shouldUseDarkMode(currentPath, true) && "mt-[-100px]"} ${
                shouldUseDarkMode(currentPath) && "mt-[-100px]"
              }` // This is to account for the navbar height when dark mode is enabled
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
