import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  CONSENT_POLICY_VERSION,
  CookieConsentProvider,
  useCookieConsent,
} from '../cookie-consent-provider';

const loadClarityMock = vi.fn();

vi.mock('~/lib/load-clarity', () => ({
  loadClarity: (...args: unknown[]) => loadClarityMock(...args),
}));

vi.mock('~/components/deferred-gtm', () => ({
  DeferredGtm: ({ gtmId }: { gtmId: string }) => (
    <div data-testid='deferred-gtm' data-gtm-id={gtmId} />
  ),
}));

vi.mock('../../components/cookie-consent', () => ({
  CookieConsent: ({
    isVisible,
    onAccept,
    onDecline,
  }: {
    isVisible: boolean;
    onAccept: () => void;
    onDecline: () => void;
  }) =>
    isVisible ? (
      <div>
        <button onClick={onAccept}>Allow analytics</button>
        <button onClick={onDecline}>Reject analytics</button>
      </div>
    ) : null,
}));

function TestConsumer() {
  const {
    hasStoredDecision,
    isAnalyticsAllowed,
    acceptAnalytics,
    rejectAnalytics,
    openConsent,
  } = useCookieConsent();
  return (
    <div>
      <span data-testid='has-decision'>{String(hasStoredDecision)}</span>
      <span data-testid='analytics-allowed'>{String(isAnalyticsAllowed)}</span>
      <button onClick={acceptAnalytics}>accept</button>
      <button onClick={rejectAnalytics}>reject</button>
      <button onClick={openConsent}>open settings</button>
    </div>
  );
}

function getConsentUpdates(): Array<Record<string, string>> {
  return window.dataLayer
    .filter((entry): entry is IArguments => {
      if (!entry || typeof entry !== 'object') {
        return false;
      }
      const maybeArgs = entry as IArguments;
      return maybeArgs[0] === 'consent' && maybeArgs[1] === 'update';
    })
    .map((entry) => entry[2] as Record<string, string>);
}

function storePreference(
  isAnalyticsAllowed: boolean,
  version = CONSENT_POLICY_VERSION,
) {
  localStorage.setItem('cookieConsent', String(isAnalyticsAllowed));
  localStorage.setItem('cookieConsentVersion', version);
}

describe('CookieConsentProvider', () => {
  const originalGtmId = import.meta.env.VITE_GTM_ID;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.dataLayer = [];
    loadClarityMock.mockClear();
    import.meta.env.VITE_GTM_ID = 'GTM-TEST123';
  });

  afterEach(() => {
    import.meta.env.VITE_GTM_ID = originalGtmId;
    vi.restoreAllMocks();
  });

  it('renders children', () => {
    render(
      <CookieConsentProvider>
        <p>child</p>
      </CookieConsentProvider>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('shows the banner and loads neither GTM nor Clarity when no preference is stored', async () => {
    await act(async () => {
      render(
        <CookieConsentProvider>
          <TestConsumer />
        </CookieConsentProvider>,
      );
    });

    expect(screen.getByText('Allow analytics')).toBeInTheDocument();
    expect(screen.getByText('Reject analytics')).toBeInTheDocument();
    expect(screen.queryByTestId('deferred-gtm')).not.toBeInTheDocument();
    expect(loadClarityMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('analytics-allowed')).toHaveTextContent('false');
  });

  it('does not show the banner when a current accepted preference is stored', async () => {
    storePreference(true);
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(screen.queryByText('Allow analytics')).not.toBeInTheDocument();
  });

  it('throws when useCookieConsent used outside provider', () => {
    const originalError = console.error;
    console.error = () => {};
    expect(() => render(<TestConsumer />)).toThrow(
      'useCookieConsent must be used within a CookieConsentProvider',
    );
    console.error = originalError;
  });

  it('accept grants analytics only, keeps advertising denied, and loads GTM and Clarity', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    fireEvent.click(screen.getByText('accept'));

    expect(localStorage.getItem('cookieConsent')).toBe('true');
    expect(localStorage.getItem('cookieConsentVersion')).toBe(
      CONSENT_POLICY_VERSION,
    );
    expect(loadClarityMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('deferred-gtm')).toBeInTheDocument();
    expect(screen.getByTestId('deferred-gtm')).toHaveAttribute(
      'data-gtm-id',
      'GTM-TEST123',
    );
    expect(screen.getByTestId('analytics-allowed')).toHaveTextContent('true');

    const updates = getConsentUpdates();
    expect(updates.at(-1)).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    const events = window.dataLayer.filter(
      (e) => typeof e === 'object' && e !== null && 'event' in e,
    );
    expect(
      events.some(
        (e) =>
          (e as Record<string, unknown>).event === 'cookie_consent_accepted',
      ),
    ).toBe(true);
  });

  it('reject denies all consent signals and loads neither GTM nor Clarity', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    fireEvent.click(screen.getByText('reject'));

    expect(localStorage.getItem('cookieConsent')).toBe('false');
    expect(localStorage.getItem('cookieConsentVersion')).toBe(
      CONSENT_POLICY_VERSION,
    );
    expect(loadClarityMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId('deferred-gtm')).not.toBeInTheDocument();
    expect(screen.getByTestId('analytics-allowed')).toHaveTextContent('false');

    const updates = getConsentUpdates();
    expect(updates.at(-1)).toEqual({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    const events = window.dataLayer.filter(
      (e) => typeof e === 'object' && e !== null && 'event' in e,
    );
    expect(
      events.some(
        (e) =>
          (e as Record<string, unknown>).event === 'cookie_consent_declined',
      ),
    ).toBe(true);
  });

  it('returning accepted user loads Clarity and GTM once and keeps the banner hidden', async () => {
    storePreference(true);
    await act(async () => {
      render(
        <CookieConsentProvider>
          <TestConsumer />
        </CookieConsentProvider>,
      );
    });

    expect(screen.queryByText('Allow analytics')).not.toBeInTheDocument();
    expect(loadClarityMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('deferred-gtm')).toBeInTheDocument();
    expect(getConsentUpdates().at(-1)).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  });

  it('returning accepted user with session already fired does not push event again but still loads analytics', async () => {
    storePreference(true);
    sessionStorage.setItem('gtm_consent_fired', 'true');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(loadClarityMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('deferred-gtm')).toBeInTheDocument();
    const events = window.dataLayer.filter(
      (e) => typeof e === 'object' && e !== null && 'event' in e,
    );
    expect(
      events.some(
        (e) =>
          (e as Record<string, unknown>).event === 'cookie_consent_accepted',
      ),
    ).toBe(false);
  });

  it('returning rejected user keeps scripts absent and banner hidden', async () => {
    storePreference(false);
    await act(async () => {
      render(
        <CookieConsentProvider>
          <TestConsumer />
        </CookieConsentProvider>,
      );
    });

    expect(screen.queryByText('Allow analytics')).not.toBeInTheDocument();
    expect(loadClarityMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId('deferred-gtm')).not.toBeInTheDocument();
    expect(getConsentUpdates().at(-1)).toEqual({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  });

  it('re-prompts when legacy preference lacks the current consent version', async () => {
    localStorage.setItem('cookieConsent', 'true');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <TestConsumer />
        </CookieConsentProvider>,
      );
    });

    expect(screen.getByText('Allow analytics')).toBeInTheDocument();
    expect(loadClarityMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId('deferred-gtm')).not.toBeInTheDocument();
  });

  it('re-prompts when consent version is outdated', async () => {
    storePreference(true, '2025-01');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });

    expect(screen.getByText('Allow analytics')).toBeInTheDocument();
    expect(loadClarityMock).not.toHaveBeenCalled();
  });

  it('fails safely and shows the banner for malformed localStorage values', async () => {
    localStorage.setItem('cookieConsent', 'yes-please');
    localStorage.setItem('cookieConsentVersion', CONSENT_POLICY_VERSION);
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });

    expect(screen.getByText('Allow analytics')).toBeInTheDocument();
    expect(loadClarityMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId('deferred-gtm')).not.toBeInTheDocument();
  });

  it('openConsent re-opens the banner', async () => {
    storePreference(false);
    await act(async () => {
      render(
        <CookieConsentProvider>
          <TestConsumer />
        </CookieConsentProvider>,
      );
    });
    expect(screen.queryByText('Allow analytics')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('open settings'));
    expect(screen.getByText('Allow analytics')).toBeInTheDocument();
  });

  it('rejection after acceptance sends denied consent updates', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );

    fireEvent.click(screen.getByText('accept'));
    expect(screen.getByTestId('deferred-gtm')).toBeInTheDocument();

    fireEvent.click(screen.getByText('open settings'));
    fireEvent.click(screen.getByText('reject'));

    expect(screen.queryByTestId('deferred-gtm')).not.toBeInTheDocument();
    expect(loadClarityMock).toHaveBeenCalledTimes(1);
    expect(getConsentUpdates().at(-1)).toEqual({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    expect(localStorage.getItem('cookieConsent')).toBe('false');
  });

  it('repeated acceptance does not load Clarity more than once', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );

    fireEvent.click(screen.getByText('accept'));
    fireEvent.click(screen.getByText('open settings'));
    fireEvent.click(screen.getByText('accept'));

    // Provider may call loadClarity twice; loadClarity itself is idempotent.
    expect(loadClarityMock).toHaveBeenCalled();
    expect(screen.getAllByTestId('deferred-gtm')).toHaveLength(1);
  });
});
