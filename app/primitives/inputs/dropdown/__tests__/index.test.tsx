import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Dropdown from "../dropdown.primitive";

const mockOptions = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C", disabled: true },
];

describe("Dropdown", () => {
  it("renders placeholder when no value selected", () => {
    render(<Dropdown options={mockOptions} placeholder="Choose one" />);
    expect(screen.getByText("Choose one")).toBeInTheDocument();
  });

  it("renders selected option label", () => {
    render(<Dropdown options={mockOptions} value="a" />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(
      <Dropdown options={mockOptions} label="My Label" />
    );
    expect(screen.getByText("My Label")).toBeInTheDocument();
  });

  it("shows required asterisk when required", () => {
    render(<Dropdown options={mockOptions} label="My Label" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("opens dropdown list when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={mockOptions} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("calls onChange when option is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Dropdown options={mockOptions} onChange={onChange} />);
    await user.click(screen.getByRole("button"));
    // Click Option B from the dropdown list (role="option")
    const options = screen.getAllByRole("option");
    await user.click(options[1]); // Option B
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("does not call onChange for disabled option", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Dropdown options={mockOptions} onChange={onChange} />);
    await user.click(screen.getByRole("button"));
    const options = screen.getAllByRole("option");
    await user.click(options[2]); // Option C is disabled
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows error message when error is provided", () => {
    render(<Dropdown options={mockOptions} error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Dropdown options={mockOptions} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows no options message when options array is empty", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={[]} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("No options available")).toBeInTheDocument();
  });

  it("closes dropdown when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={mockOptions} />);
    await user.click(screen.getByRole("button"));
    // Options visible
    expect(screen.getByText("Option A")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("button"), { key: "Escape" });
    // After Escape the list should be closed — options no longer present as listbox items
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
