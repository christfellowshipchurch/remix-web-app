import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextareaInput from '../textarea.primitive';

describe('TextareaInput', () => {
  it('renders textarea', () => {
    render(
      <TextareaInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows error message when error is set', () => {
    render(
      <TextareaInput
        value=''
        error='Required'
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('applies textarea base styles', () => {
    render(
      <TextareaInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(screen.getByRole('textbox').className).toContain('min-h-[120px]');
    expect(screen.getByRole('textbox').className).toContain('rounded-[10px]');
  });
});
