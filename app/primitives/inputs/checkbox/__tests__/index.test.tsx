import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../checkbox.primitive';

describe('Checkbox', () => {
  it('renders label', () => {
    render(
      <Checkbox checked={false} onChange={vi.fn()} label='Accept terms' />,
    );
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('reflects checked state', () => {
    render(<Checkbox checked={true} onChange={vi.fn()} label='Checked' />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label='Toggle me' />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('applies unchecked Figma styles', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label='Style' />);
    expect(screen.getByRole('checkbox').className).toContain(
      'border-form-stroke-muted',
    );
    expect(screen.getByRole('checkbox').className).toContain('rounded-[6px]');
  });

  it('applies error styles when error is true', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label='Error' error />);
    expect(screen.getByRole('checkbox').className).toContain('border-alert');
  });

  it('supports disabled state', () => {
    render(
      <Checkbox checked={true} onChange={vi.fn()} label='Disabled' disabled />,
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
