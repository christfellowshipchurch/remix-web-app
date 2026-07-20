import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FooterColumnComponent } from './footer-column.component';
import { footerColumns } from './footer-data';
import { CookieConsentProvider } from '~/providers/cookie-consent-provider';

vi.mock('~/components', () => ({
  ConnectCardModal: ({ buttonTitle }: { buttonTitle?: string }) => (
    <button>{buttonTitle}</button>
  ),
  NewsletterSubscriptionModal: ({ buttonTitle }: { buttonTitle?: string }) => (
    <button data-testid='newsletter-subscription-modal'>{buttonTitle}</button>
  ),
  PrayerRequestModal: ({ buttonTitle }: { buttonTitle?: string }) => (
    <button>{buttonTitle}</button>
  ),
}));

vi.mock('~/lib/load-clarity', () => ({
  loadClarity: vi.fn(),
}));

describe('FooterColumnComponent', () => {
  it('renders Subscribe to Updates as the newsletter subscription modal trigger', () => {
    const connectColumn = footerColumns.find(
      (column) => column.title === 'Connect',
    );

    expect(connectColumn).toBeDefined();
    render(
      <CookieConsentProvider>
        <FooterColumnComponent column={connectColumn!} />
      </CookieConsentProvider>,
    );

    expect(
      screen.getByTestId('newsletter-subscription-modal'),
    ).toHaveTextContent('Subscribe to Updates');
    expect(
      screen.queryByRole('link', { name: /subscribe to updates/i }),
    ).not.toBeInTheDocument();
  });

  it('renders Cookie Settings as a button that opens consent', () => {
    localStorage.setItem('cookieConsent', 'true');
    const aboutColumn = footerColumns.find(
      (column) => column.title === 'About',
    );

    expect(aboutColumn).toBeDefined();
    render(
      <CookieConsentProvider>
        <FooterColumnComponent column={aboutColumn!} />
      </CookieConsentProvider>,
    );

    const cookieSettings = screen.getByRole('button', {
      name: 'Cookie Settings',
    });
    expect(cookieSettings).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /cookie settings/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(cookieSettings);
    expect(
      screen.getByRole('dialog', { name: /cookie settings/i }),
    ).toBeInTheDocument();
  });
});
