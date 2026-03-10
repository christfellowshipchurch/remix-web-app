import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TextFieldInput from "../text-field.primitive";

describe("TextFieldInput", () => {
  it("renders input element", () => {
    render(
      <TextFieldInput
        value=""
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(
      <TextFieldInput
        label="Email"
        value=""
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows required asterisk and text when isRequired is true", () => {
    render(
      <TextFieldInput
        label="Email"
        value=""
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        isRequired
      />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("(required)")).toBeInTheDocument();
  });

  it("displays current value", () => {
    render(
      <TextFieldInput
        value="hello@test.com"
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue("hello@test.com")).toBeInTheDocument();
  });

  it("calls setValue on input change", () => {
    const setValue = vi.fn();
    render(
      <TextFieldInput
        value=""
        error={null}
        setValue={setValue}
        setError={vi.fn()}
      />
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "new value" },
    });
    expect(setValue).toHaveBeenCalledWith("new value");
  });

  it("renders with placeholder", () => {
    render(
      <TextFieldInput
        value=""
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        placeholder="Enter email"
      />
    );
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("renders error state when error is provided", () => {
    render(
      <TextFieldInput
        value=""
        error="Invalid email"
        setValue={vi.fn()}
        setError={vi.fn()}
      />
    );
    // In error state the input is readOnly — no onChange
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("readonly");
  });

  it("clears error on focus when in error state", () => {
    const setError = vi.fn();
    render(
      <TextFieldInput
        value=""
        error="Something went wrong"
        setValue={vi.fn()}
        setError={setError}
      />
    );
    fireEvent.focus(screen.getByRole("textbox"));
    expect(setError).toHaveBeenCalledWith(null);
  });

  it("renders name attribute when provided", () => {
    render(
      <TextFieldInput
        name="email-field"
        value=""
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />
    );
    expect(document.querySelector("input[name='email-field']")).toBeInTheDocument();
  });
});
