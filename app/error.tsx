/** Root Error Boundary */
import { useLocation } from "react-router-dom";
import { Navbar, Footer } from "./components";
import { AuthProvider } from "./providers/auth-provider";
import { CookieConsentProvider } from "./providers/cookie-consent-provider";
import { cn } from "./lib/utils";
import { shouldUseDarkMode } from "./components/navbar/navbar-routes";
import { GTMProvider } from "./providers/gtm-provider";
import { NavbarVisibilityProvider } from "./providers/navbar-visibility-context";
import { NotFound } from "./components/not-found";

export function ErrorBoundary() {
  const { pathname } = useLocation();

  return (
    <GTMProvider gtmId="GTM-PFW26V4V">
      <AuthProvider>
        <CookieConsentProvider>
          <NavbarVisibilityProvider>
            <div
              className={cn(
                "min-h-screen flex flex-col",
                shouldUseDarkMode(pathname)
                  ? "bg-dark-navy text-white"
                  : "bg-white"
              )}
            >
              <Navbar />
              <main className={cn("flex-1")}>
                <NotFound />
              </main>
              <Footer />
            </div>
          </NavbarVisibilityProvider>
        </CookieConsentProvider>
      </AuthProvider>
    </GTMProvider>
  );
}
