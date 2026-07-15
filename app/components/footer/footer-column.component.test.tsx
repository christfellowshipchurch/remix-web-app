import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FooterColumnComponent } from './footer-column.component';
import { footerColumns } from './footer-data';

const openConsent = vi.fn();

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

vi.mock('~/providers/cookie-consent-provider', () => ({
  useCookieConsent: () => ({ openConsent }),
}));

describe('FooterColumnComponent', () => {
  it('renders Subscribe to Updates as the newsletter subscription modal trigger', () => {
    const connectColumn = footerColumns.find(
      (column) => column.title === 'Connect',
    );

    expect(connectColumn).toBeDefined();
    render(<FooterColumnComponent column={connectColumn!} />);

    expect(
      screen.getByTestId('newsletter-subscription-modal'),
    ).toHaveTextContent('Subscribe to Updates');
    expect(
      screen.queryByRole('link', { name: /subscribe to updates/i }),
    ).not.toBeInTheDocument();
  });

  it('renders Cookie Settings as a button that re-opens the consent banner', () => {
    openConsent.mockClear();
    const aboutColumn = footerColumns.find(
      (column) => column.title === 'About',
    );

    expect(aboutColumn).toBeDefined();
    render(<FooterColumnComponent column={aboutColumn!} />);

    const button = screen.getByRole('button', { name: 'Cookie Settings' });
    // It must be a button (an action), not a navigation link.
    expect(
      screen.queryByRole('link', { name: /cookie settings/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(openConsent).toHaveBeenCalledTimes(1);
  });
});
