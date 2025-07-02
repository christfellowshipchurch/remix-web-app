/** Root Error Boundary */
import {
  isRouteErrorResponse,
  useRouteError,
  useLocation,
} from "react-router-dom";
import { Navbar, Footer } from "./components";
import { AuthProvider } from "./providers/auth-provider";
import { CookieConsentProvider } from "./providers/cookie-consent-provider";
import { cn } from "./lib/utils";
import { Button } from "./primitives/button/button.primitive";
import { shouldUseDarkMode } from "./components/navbar/navbar-routes";

export function ErrorBoundary() {
  const error = useRouteError();
  const { pathname } = useLocation();

  return (
    <AuthProvider>
      <CookieConsentProvider>
        <div
          className={cn(
            "min-h-screen flex flex-col",
            shouldUseDarkMode(pathname) ? "bg-dark-navy text-white" : "bg-white"
          )}
        >
          <Navbar />
          <main className={cn("flex-1")}>
            {isRouteErrorResponse(error) ? (
              <div className="p-6 mt-20">
                <h1 className="text-4xl font-bold mb-6">
                  ⚠ {error.status} {error.statusText}
                </h1>
                <p className="text-lg italic">{error.data}</p>
                <Button href="/">Go to Home</Button>
              </div>
            ) : error instanceof Error ? (
              <div className="p-6 mt-20">
                <h1 className="text-4xl font-bold mb-6">Error</h1>
                <p className="text-lg italic">{error.message}</p>
                <p className="text-lg font-bold mt-10">The stack trace is:</p>
                <pre className="text-wrap mx-10">{error.stack}</pre>
              </div>
            ) : (
              <div className="p-6 mt-20">
                <h1 className="text-4xl font-bold mb-6">Unknown Error</h1>
                <p className="text-lg italic">An unexpected error occurred.</p>
              </div>
            )}
          </main>
          <Footer />
        </div>
      </CookieConsentProvider>
    </AuthProvider>
  );
}
