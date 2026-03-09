import * as Form from "@radix-ui/react-form";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ConnectCardForm, {
  renderInputField,
  renderCheckboxField,
} from "../connect-form.component";

vi.mock("~/lib/gtm", () => ({ pushFormEvent: vi.fn() }));

// Configurable fetcher state
let mockFetcherState = { state: "idle" as "idle" | "submitting" | "loading", data: undefined as unknown };
const mockLoad = vi.fn();
const mockSubmit = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useFetcher: () => ({
      state: mockFetcherState.state,
      data: mockFetcherState.data,
      load: mockLoad,
      submit: mockSubmit,
    }),
  };
});

function renderForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter>
      <ConnectCardForm onSuccess={onSuccess} />
    </MemoryRouter>
  );
}

describe("renderInputField", () => {
  it("renders label text", () => {
    render(
      <MemoryRouter>
        <Form.Root>{renderInputField("email", "Email", "text", "Required")}</Form.Root>
      </MemoryRouter>
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders input with correct type", () => {
    render(
      <MemoryRouter>
        <Form.Root>{renderInputField("phone", "Phone", "number", "Required")}</Form.Root>
      </MemoryRouter>
    );
    expect(document.querySelector("input[type='number']")).toBeInTheDocument();
  });

  it("applies defaultValue", () => {
    render(
      <MemoryRouter>
        <Form.Root>{renderInputField("name", "Name", "text", "Required", "John")}</Form.Root>
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
  });
});

describe("renderCheckboxField", () => {
  it("renders checkbox input", () => {
    const option = { guid: "guid-1", value: "Join a Group" };
    render(
      <MemoryRouter>
        <Form.Root>{renderCheckboxField(option, 0)}</Form.Root>
      </MemoryRouter>
    );
    expect(document.querySelector("input[type='checkbox']")).toBeInTheDocument();
  });

  it("renders checkbox label", () => {
    const option = { guid: "guid-1", value: "Join a Group" };
    render(
      <MemoryRouter>
        <Form.Root>{renderCheckboxField(option, 0)}</Form.Root>
      </MemoryRouter>
    );
    expect(screen.getByText("Join a Group")).toBeInTheDocument();
  });
});

describe("ConnectCardForm", () => {
  beforeEach(() => {
    mockFetcherState = { state: "idle", data: undefined };
    vi.clearAllMocks();
  });

  it("renders the 'Get Connected' heading", () => {
    renderForm();
    expect(screen.getByText("Get Connected")).toBeInTheDocument();
  });

  it("renders First Name, Last Name, Phone, Email fields", () => {
    renderForm();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders Campus select with placeholder option", () => {
    renderForm();
    expect(screen.getByText("Select a Campus")).toBeInTheDocument();
  });

  it("renders decision checkbox", () => {
    renderForm();
    expect(
      screen.getByText("I made a decision to follow Christ today")
    ).toBeInTheDocument();
  });

  it("renders Submit button", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows campuses in select when fetcher data loads", () => {
    mockFetcherState = {
      state: "idle",
      data: {
        campuses: [
          { guid: "guid-1", name: "Palm Beach Gardens" },
          { guid: "guid-2", name: "Stuart" },
        ],
        allThatApplies: [],
      },
    };
    renderForm();
    expect(screen.getByText("Palm Beach Gardens")).toBeInTheDocument();
    expect(screen.getByText("Stuart")).toBeInTheDocument();
  });

  it("shows 'I am looking to:' section with checkboxes from fetcher data", () => {
    mockFetcherState = {
      state: "idle",
      data: {
        campuses: [],
        allThatApplies: [
          { guid: "g1", value: "Join a Group" },
          { guid: "g2", value: "Get Baptized" },
        ],
      },
    };
    renderForm();
    expect(screen.getByText("I am looking to:")).toBeInTheDocument();
    expect(screen.getByText("Join a Group")).toBeInTheDocument();
    expect(screen.getByText("Get Baptized")).toBeInTheDocument();
  });

  it("shows Loading... on submit button when submitting", () => {
    mockFetcherState = { state: "submitting", data: undefined };
    renderForm();
    expect(screen.getByRole("button", { name: /loading/i })).toBeInTheDocument();
  });

  it("shows error message from fetcher data", () => {
    mockFetcherState = {
      state: "idle",
      data: { error: "Something went wrong" },
    };
    renderForm();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("reveals 'Other' text input when Other checkbox is toggled", () => {
    mockFetcherState = {
      state: "idle",
      data: {
        campuses: [],
        allThatApplies: [{ guid: "guid-other", value: "Other" }],
      },
    };
    renderForm();
    const checkbox = document.querySelector("input[type='checkbox'][value='guid-other']") as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    // otherContent field is not present before toggling
    expect(document.querySelector("input[name='otherContent']")).not.toBeInTheDocument();
    fireEvent.click(checkbox);
    // After click, otherContent text input appears
    expect(document.querySelector("input[name='otherContent']")).toBeInTheDocument();
  });

  it("calls fetcher.load('/connect-card') on mount", () => {
    renderForm();
    expect(mockLoad).toHaveBeenCalledWith("/connect-card");
  });
});
