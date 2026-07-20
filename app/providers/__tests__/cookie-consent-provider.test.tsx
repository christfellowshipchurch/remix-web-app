import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  CookieConsentProvider,
  useCookieConsent,
} from '../cookie-consent-provider';

const loadClarityMock = vi.fn();

vi.mock('~/lib/load-clarity', () => ({
  loadClarity: (...args: unknown[]) => loadClarityMock(...args),
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
        <button onClick={onAccept}>Accept cookies</button>
        <button onClick={onDecline}>Decline cookies</button>
      </div>
    ) : null,
}));

function TestConsumer() {
  const { hasConsent, acceptCookies, declineCookies, openConsent } =
    useCookieConsent();
  return (
    <div>
      <span data-testid='consent'>{String(hasConsent)}</span>
      <button onClick={acceptCookies}>accept</button>
      <button onClick={declineCookies}>decline</button>
      <button onClick={openConsent}>open settings</button>
    </div>
  );
}

describe('CookieConsentProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.dataLayer = [];
    loadClarityMock.mockClear();
  });

  afterEach(() => {
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

  it('shows the CookieConsent banner when no consent is stored', async () => {
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(screen.getByText('Accept cookies')).toBeInTheDocument();
    expect(screen.getByText('Decline cookies')).toBeInTheDocument();
  });

  it('does not show the banner when consent is already stored', async () => {
    localStorage.setItem('cookieConsent', 'true');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(screen.queryByText('Accept cookies')).not.toBeInTheDocument();
  });

  it('throws when useCookieConsent used outside provider', () => {
    const originalError = console.error;
    console.error = () => {};
    expect(() => render(<TestConsumer />)).toThrow(
      'useCookieConsent must be used within a CookieConsentProvider',
    );
    console.error = originalError;
  });

  it('acceptCookies sets localStorage to true and loads Clarity', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    fireEvent.click(screen.getByText('accept'));
    expect(localStorage.getItem('cookieConsent')).toBe('true');
    expect(loadClarityMock).toHaveBeenCalledTimes(1);
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

  it('declineCookies sets localStorage to false and does not load Clarity', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    fireEvent.click(screen.getByText('decline'));
    expect(localStorage.getItem('cookieConsent')).toBe('false');
    expect(loadClarityMock).not.toHaveBeenCalled();
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

  it('does not load Clarity when no consent is stored', async () => {
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(loadClarityMock).not.toHaveBeenCalled();
  });

  it('on mount with saved consent=true, loads Clarity and pushes cookie_consent_accepted if not already fired', async () => {
    localStorage.setItem('cookieConsent', 'true');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(loadClarityMock).toHaveBeenCalledTimes(1);
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

  it('on mount with saved consent=true and session already fired, does not push event again but still loads Clarity', async () => {
    localStorage.setItem('cookieConsent', 'true');
    sessionStorage.setItem('gtm_consent_fired', 'true');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(loadClarityMock).toHaveBeenCalledTimes(1);
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

  it('on mount with saved consent=false, does not load Clarity', async () => {
    localStorage.setItem('cookieConsent', 'false');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(loadClarityMock).not.toHaveBeenCalled();
  });

  it('openConsent re-opens the banner', async () => {
    localStorage.setItem('cookieConsent', 'false');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <TestConsumer />
        </CookieConsentProvider>,
      );
    });
    expect(screen.queryByText('Accept cookies')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('open settings'));
    expect(screen.getByText('Accept cookies')).toBeInTheDocument();
  });
});
