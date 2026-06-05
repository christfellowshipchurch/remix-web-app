import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RadioButtons from '../radio-buttons.primitive';

describe('RadioButtons', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];

  it('renders all options', () => {
    render(
      <RadioButtons options={options} selectedOption='a' onChange={vi.fn()} />,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(
      <RadioButtons
        options={options}
        selectedOption='a'
        onChange={onChange}
        name='test-group'
      />,
    );
    fireEvent.click(screen.getByLabelText('Option B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('uses configurable name attribute', () => {
    render(
      <RadioButtons
        options={options}
        selectedOption='a'
        onChange={vi.fn()}
        name='gender'
      />,
    );
    const radios = screen.getAllByRole('radio', { hidden: true });
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'gender');
    });
  });

  it('renders vertical group with gap utility class', () => {
    const { container } = render(
      <RadioButtons
        options={options}
        selectedOption='a'
        onChange={vi.fn()}
        orientation='vertical'
      />,
    );
    expect(container.firstChild).toHaveClass('gap-2.5');
  });
});
