import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { CookieConsent } from '../components/cookie-consent';

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | unknown[] | IArguments>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clarity?: any;
  }
}

const CLARITY_PROJECT_ID = 'ojo9prqys0';

// Loads Microsoft Clarity on demand. Idempotent: Clarity sets window.clarity
// once bootstrapped, so repeat calls no-op. Only invoked after the user grants
// consent (a fresh Accept, or a remembered "accepted" choice on mount) so the
// tracker never fires before consent.
function loadClarity() {
  if (typeof window === 'undefined' || window.clarity) return;

  // Minimal Clarity bootstrap (per Microsoft's snippet): queue any calls until
  // the async tag script loads, then inject it.
  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    (document.head || document.documentElement).appendChild(script);
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
  // Banner visibility is owned here so the "Cookie Settings" link can re-open it.
  const [isConsentOpen, setIsConsentOpen] = useState(false);
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
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');

    if (savedConsent === 'true') {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });

      loadClarity();

      if (!sessionStorage.getItem('gtm_consent_fired')) {
        window.dataLayer.push({ event: 'cookie_consent_accepted' });
        sessionStorage.setItem('gtm_consent_fired', 'true');
      }
    } else if (savedConsent === 'false') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    } else {
      // No choice stored yet — prompt the user.
      setIsConsentOpen(true);
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

      loadClarity();

      window.dataLayer.push({ event: 'cookie_consent_accepted' });
      sessionStorage.setItem('gtm_consent_fired', 'true');
      localStorage.setItem('cookieConsent', 'true');
      setIsConsentOpen(false);
    }
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
      setIsConsentOpen(false);
    }
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
        openConsent: () => setIsConsentOpen(true),
      }}
    >
      {children}
      <CookieConsent
        isOpen={isConsentOpen}
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
