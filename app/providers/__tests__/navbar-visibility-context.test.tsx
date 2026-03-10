import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  NavbarVisibilityProvider,
  useNavbarVisibility,
} from "../navbar-visibility-context";

function TestConsumer() {
  const { isNavbarVisible, setIsNavbarVisible } = useNavbarVisibility();
  return (
    <div>
      <span data-testid="visibility">{String(isNavbarVisible)}</span>
      <button onClick={() => setIsNavbarVisible(false)}>hide</button>
      <button onClick={() => setIsNavbarVisible(true)}>show</button>
    </div>
  );
}

describe("NavbarVisibilityProvider", () => {
  it("provides default isNavbarVisible as true", () => {
    render(
      <NavbarVisibilityProvider>
        <TestConsumer />
      </NavbarVisibilityProvider>
    );
    expect(screen.getByTestId("visibility").textContent).toBe("true");
  });

  it("updates isNavbarVisible to false", () => {
    render(
      <NavbarVisibilityProvider>
        <TestConsumer />
      </NavbarVisibilityProvider>
    );
    fireEvent.click(screen.getByText("hide"));
    expect(screen.getByTestId("visibility").textContent).toBe("false");
  });

  it("updates isNavbarVisible back to true", () => {
    render(
      <NavbarVisibilityProvider>
        <TestConsumer />
      </NavbarVisibilityProvider>
    );
    fireEvent.click(screen.getByText("hide"));
    fireEvent.click(screen.getByText("show"));
    expect(screen.getByTestId("visibility").textContent).toBe("true");
  });

  it("throws when useNavbarVisibility used outside provider", () => {
    const originalError = console.error;
    console.error = () => {};
    expect(() => render(<TestConsumer />)).toThrow(
      "useNavbarVisibility must be used within a NavbarVisibilityProvider"
    );
    console.error = originalError;
  });

  it("renders children", () => {
    render(
      <NavbarVisibilityProvider>
        <p>child content</p>
      </NavbarVisibilityProvider>
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });
});
