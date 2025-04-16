import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Breadcrumbs } from "../index";
import { describe, it, expect } from "vitest";

describe("Breadcrumbs", () => {
  it("renders home link by default", () => {
    render(
      <MemoryRouter>
        <Breadcrumbs />
      </MemoryRouter>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders correct path segments", () => {
    const testPath = "/test/path/segment";
    render(
      <MemoryRouter initialEntries={[testPath]}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Path")).toBeInTheDocument();
    expect(screen.getByText("Segment")).toBeInTheDocument();
  });

  it("applies correct text color for light mode", () => {
    render(
      <MemoryRouter>
        <Breadcrumbs mode="light" />
      </MemoryRouter>
    );

    const homeLink = screen.getByText("Home");
    expect(homeLink).toHaveClass("text-neutral-400");

    // Verify the container has light mode text color
    const container = homeLink.closest("div");
    expect(container).toHaveClass("text-neutral-300");
  });

  it("applies correct text color for dark mode", () => {
    render(
      <MemoryRouter>
        <Breadcrumbs mode="dark" />
      </MemoryRouter>
    );

    const homeLink = screen.getByText("Home");
    expect(homeLink).toHaveClass("text-neutral-500");

    // Verify the container has dark mode text color
    const container = homeLink.closest("div");
    expect(container).toHaveClass("text-neutral-700");
  });

  it("renders caret icons between segments", () => {
    const testPath = "/test/path";
    render(
      <MemoryRouter initialEntries={[testPath]}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    const carets = document.querySelectorAll("#breadcrumbs-caret");
    expect(carets).toHaveLength(2); // One for each path segment
  });

  it("decodes URI components correctly", () => {
    const testPath = "/test%20path/encoded%20segment";
    render(
      <MemoryRouter initialEntries={[testPath]}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText("Test path")).toBeInTheDocument();
    expect(screen.getByText("Encoded segment")).toBeInTheDocument();
  });

  it("capitalizes words in path segments", () => {
    const testPath = "/test-path/another-segment";
    render(
      <MemoryRouter initialEntries={[testPath]}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Path")).toBeInTheDocument();
    expect(screen.getByText("Another Segment")).toBeInTheDocument();
  });
});
