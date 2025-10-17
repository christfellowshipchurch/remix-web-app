import { createContext, useContext, ReactNode } from "react";
import { CookieConsent } from "../components/cookie-consent";

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
    // Add any additional cookie acceptance logic here
    // eslint-disable-next-line no-console
    console.log("Cookies accepted");
  };

  const handleDeclineCookies = () => {
    // Add any additional cookie declination logic here
    // eslint-disable-next-line no-console
    console.log("Cookies declined");
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
