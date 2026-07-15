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

  it('renders when isOpen is true', () => {
    render(
      <CookieConsent
        isOpen
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

  it('does not render when isOpen is false', () => {
    render(
      <CookieConsent
        isOpen={false}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onAccept when Accept is clicked', () => {
    render(
      <CookieConsent
        isOpen
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));

    expect(mockOnAccept).toHaveBeenCalledTimes(1);
    expect(mockOnDecline).not.toHaveBeenCalled();
  });

  it('calls onDecline when Decline is clicked', () => {
    render(
      <CookieConsent
        isOpen
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Decline' }));

    expect(mockOnDecline).toHaveBeenCalledTimes(1);
    expect(mockOnAccept).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(
      <CookieConsent
        isOpen
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
