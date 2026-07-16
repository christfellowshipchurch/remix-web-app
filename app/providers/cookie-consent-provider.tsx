import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { CookieConsent } from '../components/cookie-consent';
import { DeferredGtm } from '~/components/deferred-gtm';
import { loadClarity } from '~/lib/load-clarity';

/** Bump when consent semantics change so legacy preferences are re-prompted. */
export const CONSENT_POLICY_VERSION = '2026-07';

const CONSENT_STORAGE_KEY = 'cookieConsent';
const CONSENT_VERSION_KEY = 'cookieConsentVersion';

const DENIED_CONSENT = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

const ANALYTICS_GRANTED_CONSENT = {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | unknown[] | IArguments>;
  }
}

interface CookieConsentContextType {
  /** Whether a valid, current-version preference is stored (accepted or rejected). */
  hasStoredDecision: boolean | null;
  /** Whether the user has granted analytics (not the same as hasStoredDecision). */
  isAnalyticsAllowed: boolean;
  acceptAnalytics: () => void;
  rejectAnalytics: () => void;
  openConsent: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

// GTM specifically looks for the 'arguments' object to be pushed.
// Use function declaration (not arrow function) to access arguments object.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag: (...args: any[]) => void = function () {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    // Matches Google's specification; arguments object required for GTM compatibility.
    window.dataLayer.push(arguments);
  }
};

function readStoredAnalyticsPreference(): boolean | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
  const savedVersion = localStorage.getItem(CONSENT_VERSION_KEY);

  // Legacy PR #358 preferences (boolean without current version) are re-prompted.
  if (savedVersion !== CONSENT_POLICY_VERSION) {
    return null;
  }

  if (savedConsent === 'true') {
    return true;
  }

  if (savedConsent === 'false') {
    return false;
  }

  return null;
}

function persistAnalyticsPreference(isAnalyticsAllowed: boolean): void {
  localStorage.setItem(CONSENT_STORAGE_KEY, String(isAnalyticsAllowed));
  localStorage.setItem(CONSENT_VERSION_KEY, CONSENT_POLICY_VERSION);
}

function pushConsentUpdate(
  consent: typeof DENIED_CONSENT | typeof ANALYTICS_GRANTED_CONSENT,
): void {
  gtag('consent', 'update', consent);
}

function pushAcceptedEventOncePerSession(force = false): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!force && sessionStorage.getItem('gtm_consent_fired')) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'cookie_consent_accepted' });
  sessionStorage.setItem('gtm_consent_fired', 'true');
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isAnalyticsAllowed, setIsAnalyticsAllowed] = useState(false);
  const [hasStoredDecision, setHasStoredDecision] = useState<boolean | null>(
    null,
  );
  const gtmId = import.meta.env.VITE_GTM_ID as string | undefined;

  // Restore preference on mount: apply consent signals, load Clarity when granted,
  // and show the banner when preference is missing, malformed, or outdated.
  useEffect(() => {
    const savedPreference = readStoredAnalyticsPreference();

    if (savedPreference === null) {
      setHasStoredDecision(false);
      setIsAnalyticsAllowed(false);
      setIsBannerVisible(true);
      return;
    }

    setHasStoredDecision(true);

    if (savedPreference) {
      pushConsentUpdate(ANALYTICS_GRANTED_CONSENT);
      pushAcceptedEventOncePerSession();
      loadClarity();
      setIsAnalyticsAllowed(true);
      return;
    }

    pushConsentUpdate(DENIED_CONSENT);
    setIsAnalyticsAllowed(false);
  }, []);

  const acceptAnalytics = () => {
    if (typeof window !== 'undefined') {
      pushConsentUpdate(ANALYTICS_GRANTED_CONSENT);
      pushAcceptedEventOncePerSession(true);
      persistAnalyticsPreference(true);
      loadClarity();
      setIsAnalyticsAllowed(true);
      setHasStoredDecision(true);
    }
    setIsBannerVisible(false);
  };

  const rejectAnalytics = () => {
    if (typeof window !== 'undefined') {
      // Send denied signals before persisting so a prior grant is revoked immediately.
      pushConsentUpdate(DENIED_CONSENT);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'cookie_consent_declined' });
      persistAnalyticsPreference(false);
      setIsAnalyticsAllowed(false);
      setHasStoredDecision(true);
    }
    setIsBannerVisible(false);
  };

  const openConsent = () => {
    setIsBannerVisible(true);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasStoredDecision,
        isAnalyticsAllowed,
        acceptAnalytics,
        rejectAnalytics,
        openConsent,
      }}
    >
      {children}
      {isAnalyticsAllowed && gtmId ? <DeferredGtm gtmId={gtmId} /> : null}
      <CookieConsent
        isVisible={isBannerVisible}
        onAccept={acceptAnalytics}
        onDecline={rejectAnalytics}
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
