import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SelectInput from '../select-input.primitive';

describe('SelectInput', () => {
  const options = [
    { value: '1', label: 'One' },
    { value: '2', label: 'Two' },
  ];

  it('renders select with options', () => {
    render(
      <SelectInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        options={options}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls setValue on change', () => {
    const setValue = vi.fn();
    render(
      <SelectInput
        value=''
        error={null}
        setValue={setValue}
        setError={vi.fn()}
        options={options}
      />,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    expect(setValue).toHaveBeenCalledWith('2');
  });

  it('applies base form control styles', () => {
    render(
      <SelectInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        options={options}
      />,
    );
    expect(screen.getByRole('combobox').className).toContain('rounded-[10px]');
  });

  it('shows error message when error is set', () => {
    render(
      <SelectInput
        value=''
        error='Pick one'
        setValue={vi.fn()}
        setError={vi.fn()}
        options={options}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Pick one');
  });
});
