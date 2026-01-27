import { createContext, useContext, ReactNode } from "react";
import { CookieConsent } from "../components/cookie-consent";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
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
  const handleAcceptCookies = () => {
    // Push consent update to GTM dataLayer
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "consent",
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
  };

  const handleDeclineCookies = () => {
    // Push consent denial to GTM dataLayer
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "consent",
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
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
