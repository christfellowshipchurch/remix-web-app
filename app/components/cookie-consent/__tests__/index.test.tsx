import { render, screen, fireEvent } from '@testing-library/react';
import { CookieConsent } from '../index';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('CookieConsent', () => {
  const mockOnAccept = vi.fn();
  const mockOnDecline = vi.fn();

  beforeEach(() => {
    mockOnAccept.mockClear();
    mockOnDecline.mockClear();
  });

  it('renders when visible', () => {
    render(
      <CookieConsent
        isVisible
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Cookie Settings')).toBeInTheDocument();
    expect(screen.getByText(/We use cookies/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(
      <CookieConsent
        isVisible={false}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles accept action correctly without writing localStorage', () => {
    localStorage.clear();
    render(
      <CookieConsent
        isVisible
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));

    expect(localStorage.getItem('cookieConsent')).toBeNull();
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  it('handles decline action correctly without writing localStorage', () => {
    localStorage.clear();
    render(
      <CookieConsent
        isVisible
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Decline' }));

    expect(localStorage.getItem('cookieConsent')).toBeNull();
    expect(mockOnDecline).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(
      <CookieConsent
        isVisible
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-consent-title');

    const title = screen.getByText('Cookie Settings');
    expect(title).toHaveAttribute('id', 'cookie-consent-title');
  });
});
