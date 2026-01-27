import { createContext, useContext, ReactNode } from "react";
import { CookieConsent } from "../components/cookie-consent";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | unknown[]>;
  }
}

interface CookieConsentContextType {
  hasConsent: boolean | null;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  // Define the gtag helper function for GTM Consent API
  const gtag = (...args: unknown[]) => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    }
  };

  const handleAcceptCookies = () => {
    if (typeof window !== "undefined") {
      // Use gtag command for GTM Consent API
      gtag('consent', 'update', {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });

      // Optional: Keep a regular event push for custom triggers
      window.dataLayer.push({ event: "cookie_consent_accepted" });
    }
  };

  const handleDeclineCookies = () => {
    if (typeof window !== "undefined") {
      // Use gtag command for GTM Consent API
      gtag('consent', 'update', {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });

      // Optional: Keep a regular event push for custom triggers
      window.dataLayer.push({ event: "cookie_consent_declined" });
    }
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsent:
          typeof window !== "undefined"
            ? localStorage.getItem("cookieConsent") !== null
            : null,
        acceptCookies: handleAcceptCookies,
        declineCookies: handleDeclineCookies,
      }}
    >
      {children}
      <CookieConsent
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
      />
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
}
