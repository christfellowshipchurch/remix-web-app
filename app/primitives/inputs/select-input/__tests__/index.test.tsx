import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SelectInput from '../select-input.primitive';

const defaultOptions = [
  { value: 'ca', label: 'California' },
  { value: 'fl', label: 'Florida' },
];

describe('SelectInput', () => {
  it('renders select with options', () => {
    render(
      <SelectInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        options={defaultOptions}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('Florida')).toBeInTheDocument();
  });

  it('error state: error message shown below the select', () => {
    render(
      <SelectInput
        value=''
        error='Please select an option'
        setValue={vi.fn()}
        setError={vi.fn()}
        options={defaultOptions}
      />,
    );
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('normal state: select has rounded-[10px] class', () => {
    render(
      <SelectInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        options={defaultOptions}
      />,
    );
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('rounded-[10px]');
  });
});
