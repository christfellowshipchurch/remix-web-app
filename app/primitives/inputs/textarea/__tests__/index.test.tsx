import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextareaInput from '../textarea.primitive';

describe('TextareaInput', () => {
  it('renders a textarea element', () => {
    render(
      <TextareaInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('error state: error message shown below the textarea', () => {
    render(
      <TextareaInput
        value=''
        error='This field is required'
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('helperText prop: helper text is shown', () => {
    render(
      <TextareaInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        helperText='Max 500 characters'
      />,
    );
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('has min-h-[120px] class', () => {
    render(
      <TextareaInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea.className).toContain('min-h-[120px]');
  });
});
