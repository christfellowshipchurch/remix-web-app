import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  CookieConsentProvider,
  useCookieConsent,
} from '../cookie-consent-provider';

vi.mock('../../components/cookie-consent', () => ({
  CookieConsent: ({
    isOpen,
    onAccept,
    onDecline,
  }: {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
  }) =>
    isOpen ? (
      <div data-testid='cookie-banner'>
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
      <button onClick={openConsent}>open</button>
    </div>
  );
}

describe('CookieConsentProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.dataLayer = [];
    delete window.clarity;
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

  it('renders the CookieConsent component', () => {
    render(
      <CookieConsentProvider>
        <div />
      </CookieConsentProvider>,
    );
    expect(screen.getByText('Accept cookies')).toBeInTheDocument();
    expect(screen.getByText('Decline cookies')).toBeInTheDocument();
  });

  it('throws when useCookieConsent used outside provider', () => {
    const originalError = console.error;
    console.error = () => {};
    expect(() => render(<TestConsumer />)).toThrow(
      'useCookieConsent must be used within a CookieConsentProvider',
    );
    console.error = originalError;
  });

  it('acceptCookies sets localStorage and pushes dataLayer event', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    fireEvent.click(screen.getByText('accept'));
    expect(localStorage.getItem('cookieConsent')).toBe('true');
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

  it('declineCookies sets localStorage and pushes dataLayer event', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    fireEvent.click(screen.getByText('decline'));
    expect(localStorage.getItem('cookieConsent')).toBe('false');
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

  it('on mount with saved consent=true, pushes cookie_consent_accepted if not already fired', async () => {
    localStorage.setItem('cookieConsent', 'true');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
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

  it('on mount with saved consent=true and session already fired, does not push event again', async () => {
    localStorage.setItem('cookieConsent', 'true');
    sessionStorage.setItem('gtm_consent_fired', 'true');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
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

  // Clarity must be treated as non-essential and never fire before consent.
  it('does NOT load Clarity when no consent choice is stored', async () => {
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(window.clarity).toBeUndefined();
  });

  it('does NOT load Clarity when consent was declined', async () => {
    localStorage.setItem('cookieConsent', 'false');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(window.clarity).toBeUndefined();
  });

  it('loads Clarity on mount when consent was previously accepted', async () => {
    localStorage.setItem('cookieConsent', 'true');
    await act(async () => {
      render(
        <CookieConsentProvider>
          <div />
        </CookieConsentProvider>,
      );
    });
    expect(typeof window.clarity).toBe('function');
  });

  it('loads Clarity when the user accepts', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    expect(window.clarity).toBeUndefined();
    fireEvent.click(screen.getByText('accept'));
    expect(typeof window.clarity).toBe('function');
  });

  it('shows the banner on first visit and hides it after a choice', () => {
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    // No stored choice → banner is open.
    expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
    fireEvent.click(screen.getByText('decline'));
    expect(screen.queryByTestId('cookie-banner')).not.toBeInTheDocument();
  });

  it('openConsent re-opens the banner after a choice was made', () => {
    localStorage.setItem('cookieConsent', 'true');
    render(
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>,
    );
    // Returning user with a stored choice → banner starts closed.
    expect(screen.queryByTestId('cookie-banner')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('open'));
    expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
  });
});
