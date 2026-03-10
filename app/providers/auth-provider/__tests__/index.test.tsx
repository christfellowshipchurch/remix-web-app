import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import {
  AuthProvider,
  useAuth,
  AUTH_TOKEN_KEY,
  User_Auth_Status,
  RegistrationTypes,
} from "../index";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useRevalidator: () => ({ revalidate: mockRevalidate }),
  };
});

const mockNavigate = vi.fn();
const mockRevalidate = vi.fn();

function TestConsumer() {
  const { user, isLoading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="user">{user ? user.fullName : "null"}</span>
    </div>
  );
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const mockUser = {
  id: "1",
  fullName: "Test User",
  email: "test@test.com",
  phoneNumber: "5551234567",
  guid: "abc-123",
  gender: "Male",
  birthDate: "1990-01-01",
  photo: "/photo.jpg",
};

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with isLoading=true then sets false when no token", async () => {
    await act(async () => {
      renderWithRouter(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("loads user from token in localStorage on mount", async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "valid-token");
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    await act(async () => {
      renderWithRouter(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("Test User")
    );
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("does not set user when no token in localStorage", async () => {
    // No token — loadToken exits early, no fetch call
    await act(async () => {
      renderWithRouter(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });
    expect(global.fetch as ReturnType<typeof vi.fn>).not.toHaveBeenCalled();
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("throws when useAuth used outside AuthProvider", () => {
    const originalError = console.error;
    console.error = () => {};
    expect(() =>
      renderWithRouter(<TestConsumer />)
    ).toThrow("useAuth must be used within an AuthProvider");
    console.error = originalError;
  });

  it("renders children", async () => {
    await act(async () => {
      renderWithRouter(
        <AuthProvider>
          <p>hello world</p>
        </AuthProvider>
      );
    });
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });
});

describe("useAuth - loginWithEmail", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  function LoginTestConsumer() {
    const { loginWithEmail, user } = useAuth();
    return (
      <div>
        <span data-testid="user">{user ? user.fullName : "null"}</span>
        <button
          onClick={() => loginWithEmail("user@test.com", "password123")}
        >
          login
        </button>
      </div>
    );
  }

  it("loginWithEmail fetches token and then sets user", async () => {
    // First call: authenticate → encryptedToken
    // Second call: currentUser
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ encryptedToken: "my-token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

    await act(async () => {
      renderWithRouter(
        <AuthProvider>
          <LoginTestConsumer />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText("login").click();
    });

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("Test User")
    );
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe("my-token");
    expect(mockRevalidate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

describe("useAuth - logout", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  function LogoutTestConsumer() {
    const { logout, user } = useAuth();
    return (
      <div>
        <span data-testid="user">{user ? user.fullName : "null"}</span>
        <button onClick={logout}>logout</button>
      </div>
    );
  }

  it("logout clears user and token", async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "valid-token");
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    await act(async () => {
      renderWithRouter(
        <AuthProvider>
          <LogoutTestConsumer />
        </AuthProvider>
      );
    });

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("Test User")
    );

    act(() => {
      screen.getByText("logout").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    expect(mockRevalidate).toHaveBeenCalled();
  });
});

describe("useAuth - checkUserExists", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  function CheckUserConsumer() {
    const { checkUserExists } = useAuth();
    const [result, setResult] = React.useState<boolean | null>(null);
    return (
      <div>
        <span data-testid="result">{String(result)}</span>
        <button
          onClick={async () => {
            const r = await checkUserExists("user@test.com");
            setResult(r);
          }}
        >
          check
        </button>
      </div>
    );
  }

  it("checkUserExists returns true when userExists is true", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userExists: true }),
    });

    await act(async () => {
      renderWithRouter(
        <AuthProvider>
          <CheckUserConsumer />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText("check").click();
    });

    await waitFor(() =>
      expect(screen.getByTestId("result").textContent).toBe("true")
    );
  });
});

describe("AuthProvider - exports", () => {
  it("exports AUTH_TOKEN_KEY", () => {
    expect(AUTH_TOKEN_KEY).toBe("auth-token");
  });

  it("exports User_Auth_Status enum values", () => {
    expect(User_Auth_Status.ExistingAppUser).toBe("EXISTING_APP_USER");
    expect(User_Auth_Status.NewAppUser).toBe("NEW_APP_USER");
    expect(User_Auth_Status.None).toBe("NONE");
  });

  it("exports RegistrationTypes enum values", () => {
    expect(RegistrationTypes.EMAIL).toBe("email");
    expect(RegistrationTypes.SMS).toBe("sms");
  });
});
