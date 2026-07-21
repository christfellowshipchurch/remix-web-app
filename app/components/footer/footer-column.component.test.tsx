import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FooterColumnComponent } from './footer-column.component';
import { footerColumns } from './footer-data';

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
});
