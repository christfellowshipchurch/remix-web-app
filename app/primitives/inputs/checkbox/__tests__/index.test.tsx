import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../checkbox.primitive';

describe('Checkbox', () => {
  it('renders label text', () => {
    render(
      <Checkbox checked={false} onChange={vi.fn()} label='Accept terms' />,
    );
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders unchecked by default', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label='Accept' />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders in checked state', () => {
    render(<Checkbox checked={true} onChange={vi.fn()} label='Accept' />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange with true when unchecked box is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox checked={false} onChange={onChange} label='Accept' />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checked box is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox checked={true} onChange={onChange} label='Accept' />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('sets required attribute when required is true', () => {
    render(
      <Checkbox checked={false} onChange={vi.fn()} label='Required' required />,
    );
    expect(screen.getByRole('checkbox')).toBeRequired();
  });

  it('does not set required by default', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label='Optional' />);
    expect(screen.getByRole('checkbox')).not.toBeRequired();
  });
});
