import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { CookieConsent } from '../components/cookie-consent';
import { loadClarity } from '~/lib/load-clarity';

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | unknown[] | IArguments>;
  }
}

interface CookieConsentContextType {
  hasConsent: boolean | null;
  acceptCookies: () => void;
  declineCookies: () => void;
  openConsent: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  // GTM specifically looks for the 'arguments' object to be pushed
  // Use function declaration (not arrow function) to access arguments object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag: (...args: any[]) => void = function () {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      // This matches the exact specification Google provides
      // Use arguments object for GTM compatibility
      window.dataLayer.push(arguments);
    }
  };

  // Re-apply consent from localStorage on mount so GTM "remembers" for returning users.
  // Only push cookie_consent_accepted once per session so Page View fires once; History Change handles subsequent navigations.
  // Load Clarity only when analytics consent was previously granted.
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');

    if (!savedConsent) {
      setIsBannerVisible(true);
      return;
    }

    if (savedConsent === 'true') {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });

      if (!sessionStorage.getItem('gtm_consent_fired')) {
        window.dataLayer.push({ event: 'cookie_consent_accepted' });
        sessionStorage.setItem('gtm_consent_fired', 'true');
      }

      loadClarity();
    } else if (savedConsent === 'false') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  }, []);

  const handleAcceptCookies = () => {
    if (typeof window !== 'undefined') {
      // This will now correctly trigger GTM's internal Consent state
      gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });

      window.dataLayer.push({ event: 'cookie_consent_accepted' });
      sessionStorage.setItem('gtm_consent_fired', 'true');
      localStorage.setItem('cookieConsent', 'true');
      loadClarity();
    }
    setIsBannerVisible(false);
  };

  const handleDeclineCookies = () => {
    if (typeof window !== 'undefined') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });

      window.dataLayer.push({ event: 'cookie_consent_declined' });
      localStorage.setItem('cookieConsent', 'false');
    }
    setIsBannerVisible(false);
  };

  const openConsent = () => {
    setIsBannerVisible(true);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsent:
          typeof window !== 'undefined'
            ? localStorage.getItem('cookieConsent') !== null
            : null,
        acceptCookies: handleAcceptCookies,
        declineCookies: handleDeclineCookies,
        openConsent,
      }}
    >
      {children}
      <CookieConsent
        isVisible={isBannerVisible}
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
      'useCookieConsent must be used within a CookieConsentProvider',
    );
  }
  return context;
}
