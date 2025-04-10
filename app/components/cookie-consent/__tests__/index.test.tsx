import { render, screen, fireEvent } from "@testing-library/react";
import { CookieConsent } from "../index";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("CookieConsent", () => {
  const mockOnAccept = vi.fn();
  const mockOnDecline = vi.fn();

  beforeEach(() => {
    // Clear localStorage and mock functions before each test
    localStorage.clear();
    mockOnAccept.mockClear();
    mockOnDecline.mockClear();
  });

  it("renders when no consent is stored", () => {
    render(<CookieConsent onAccept={mockOnAccept} onDecline={mockOnDecline} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cookie Settings")).toBeInTheDocument();
    expect(screen.getByText(/We use cookies/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
  });

  it("doesn't render when consent is already accepted", () => {
    localStorage.setItem("cookieConsent", "accepted");
    render(<CookieConsent onAccept={mockOnAccept} onDecline={mockOnDecline} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("doesn't render when consent is already declined", () => {
    localStorage.setItem("cookieConsent", "declined");
    render(<CookieConsent onAccept={mockOnAccept} onDecline={mockOnDecline} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("handles accept action correctly", () => {
    render(<CookieConsent onAccept={mockOnAccept} onDecline={mockOnDecline} />);

    const acceptButton = screen.getByRole("button", { name: "Accept" });
    fireEvent.click(acceptButton);

    expect(localStorage.getItem("cookieConsent")).toBe("accepted");
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("handles decline action correctly", () => {
    render(<CookieConsent onAccept={mockOnAccept} onDecline={mockOnDecline} />);

    const declineButton = screen.getByRole("button", { name: "Decline" });
    fireEvent.click(declineButton);

    expect(localStorage.getItem("cookieConsent")).toBe("declined");
    expect(mockOnDecline).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(<CookieConsent onAccept={mockOnAccept} onDecline={mockOnDecline} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "cookie-consent-title");

    const title = screen.getByText("Cookie Settings");
    expect(title).toHaveAttribute("id", "cookie-consent-title");
  });
});
