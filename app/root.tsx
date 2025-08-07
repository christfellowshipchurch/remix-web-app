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

function getWebflowPageAttribute(pathname: string): string {
  let webflowDataAttribute = "";

  switch (pathname) {
    case "/one-life":
      webflowDataAttribute = "668fe801f1a28d6ad35222da";
      break;
    case "/next-steps":
      webflowDataAttribute = "66d89a03d565e226f00e0083";
      break;
    case "/cbo-2024":
      webflowDataAttribute = "672a56e11ae5618cff593ec3";
      break;
    case "/easter":
      webflowDataAttribute = "67b3875c4e2c8ae8345d0cdd";
      break;
    case "/easter-jam":
      webflowDataAttribute = "67c5bd33d52823431fdaa130";
      break;
    case "/christmas-at-cf":
      webflowDataAttribute = "6723dfd7d7fcb2c49854df47";
      break;
    default:
      // Default case if no matching path is found
      webflowDataAttribute = "";
      break;
  }

  return webflowDataAttribute;
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const webflowPageAttribute = getWebflowPageAttribute(location.pathname);

  return (
    <html
      lang="en"
      data-wf-site="66749aec3acbf8aa6ef9d378"
      {...(webflowPageAttribute && {
        "data-wf-page": webflowPageAttribute,
      })}
    >
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
