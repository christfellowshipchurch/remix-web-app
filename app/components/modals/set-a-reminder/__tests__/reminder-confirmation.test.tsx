import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ReminderConfirmation from "../confirmation.component";

vi.mock("~/lib/gtm", () => ({ pushFormEvent: vi.fn() }));
vi.mock("~/lib/utils", async () => {
  const actual = await vi.importActual<typeof import("~/lib/utils")>("~/lib/utils");
  return {
    ...actual,
    icsLink: () => "webcal://example.com/event.ics",
    icsLinkEvents: () => [{ event: {} }],
  };
});
vi.mock("~/primitives/icon", () => ({
  default: () => <svg data-testid="icon" />,
}));

let mockFetcherData: unknown = undefined;
let mockFetcherState = "idle";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useFetcher: () => ({
      state: mockFetcherState,
      data: mockFetcherData,
      load: vi.fn(),
    }),
  };
});

const defaultProps = {
  serviceTime: "9:00 AM",
  onSuccess: vi.fn(),
  campusUrl: "palm-beach-gardens",
  location: "Palm Beach Gardens",
};

function renderConfirmation(props = defaultProps) {
  return render(
    <MemoryRouter>
      <ReminderConfirmation {...props} />
    </MemoryRouter>
  );
}

describe("ReminderConfirmation", () => {
  beforeEach(() => {
    mockFetcherData = undefined;
    mockFetcherState = "idle";
    vi.clearAllMocks();
  });

  it("shows Loading... when data not yet available", () => {
    renderConfirmation();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders confirmation content after data loads", () => {
    mockFetcherData = {
      address: "5343 Northlake Blvd",
      url: "palm-beach-gardens",
      serviceTimes: [],
      campusName: "Palm Beach Gardens",
    };
    renderConfirmation();
    expect(screen.getByText(/check out your email/i)).toBeInTheDocument();
  });

  it("renders English text by default", () => {
    mockFetcherData = {
      address: "123 Main St",
      url: "pbg",
      serviceTimes: [],
      campusName: "Palm Beach Gardens",
    };
    renderConfirmation();
    expect(screen.getByText(/Add to Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
  });

  it("renders Español text when location contains 'Español'", () => {
    mockFetcherData = {
      address: "123 Main St",
      url: "espanol",
      serviceTimes: [],
      campusName: "Español",
    };
    renderConfirmation({ ...defaultProps, location: "Español" });
    expect(screen.getByText(/Añadir al Calendario/i)).toBeInTheDocument();
    expect(screen.getByText(/Continuar/i)).toBeInTheDocument();
  });

  it("calls onSuccess when Continue button is clicked", () => {
    const onSuccess = vi.fn();
    mockFetcherData = {
      address: "123 Main St",
      url: "pbg",
      serviceTimes: [],
      campusName: "Palm Beach Gardens",
    };
    renderConfirmation({ ...defaultProps, onSuccess });
    fireEvent.click(screen.getByText("Continue"));
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("renders Add to Calendar link", () => {
    mockFetcherData = {
      address: "123 Main St",
      url: "pbg",
      serviceTimes: [],
      campusName: "Palm Beach Gardens",
    };
    renderConfirmation();
    const link = screen.getByRole("link", { name: /Add to Calendar/i });
    expect(link).toHaveAttribute("href", "webcal://example.com/event.ics");
  });
});
