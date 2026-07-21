import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  CookieConsentProvider,
  useCookieConsent,
} from '../cookie-consent-provider';

vi.mock('../../components/cookie-consent', () => ({
  CookieConsent: ({
    onAccept,
    onDecline,
  }: {
    onAccept: () => void;
    onDecline: () => void;
  }) => (
    <div>
      <button onClick={onAccept}>Accept cookies</button>
      <button onClick={onDecline}>Decline cookies</button>
    </div>
  ),
}));

function TestConsumer() {
  const { hasConsent, acceptCookies, declineCookies } = useCookieConsent();
  return (
    <div>
      <span data-testid='consent'>{String(hasConsent)}</span>
      <button onClick={acceptCookies}>accept</button>
      <button onClick={declineCookies}>decline</button>
    </div>
  );
}

describe('CookieConsentProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.dataLayer = [];
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
});
