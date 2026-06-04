import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RadioButtons from '../radio-buttons.primitive';

const defaultOptions = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('RadioButtons', () => {
  it('renders all option labels', () => {
    render(
      <RadioButtons
        options={defaultOptions}
        selectedOption=''
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('calls onChange with the correct value when an option is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioButtons
        options={defaultOptions}
        selectedOption=''
        onChange={onChange}
      />,
    );
    // Radio inputs are hidden; click the label for Option A
    await user.click(screen.getByText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('name prop: radio inputs have the given name attribute', () => {
    const { container } = render(
      <RadioButtons
        options={defaultOptions}
        selectedOption=''
        onChange={vi.fn()}
        name='my-group'
      />,
    );
    const inputs = container.querySelectorAll('input[type="radio"]');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('name', 'my-group');
    });
  });

  it('vertical orientation: wrapper has gap-2.5 class', () => {
    const { container } = render(
      <RadioButtons
        options={defaultOptions}
        selectedOption=''
        onChange={vi.fn()}
        orientation='vertical'
      />,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('gap-2.5');
  });
});
