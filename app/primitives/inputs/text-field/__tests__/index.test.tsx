import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextFieldInput from '../text-field.primitive';

describe('TextFieldInput', () => {
  it('renders input element', () => {
    render(
      <TextFieldInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <TextFieldInput
        label='Email'
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows required asterisk and text when isRequired is true', () => {
    render(
      <TextFieldInput
        label='Email'
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        isRequired
      />,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(
      <TextFieldInput
        value='hello@test.com'
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(screen.getByDisplayValue('hello@test.com')).toBeInTheDocument();
  });

  it('calls setValue on input change', () => {
    const setValue = vi.fn();
    render(
      <TextFieldInput
        value=''
        error={null}
        setValue={setValue}
        setError={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'new value' },
    });
    expect(setValue).toHaveBeenCalledWith('new value');
  });

  it('renders with placeholder', () => {
    render(
      <TextFieldInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        placeholder='Enter email'
      />,
    );
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('renders error state when error is provided', () => {
    render(
      <TextFieldInput
        value=''
        error='Invalid email'
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    // Error message is rendered below the field
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    // Input is still editable (not readOnly) in error state
    const input = document.querySelector('input');
    expect(input).not.toHaveAttribute('readonly');
  });

  it('clears error on focus when in error state', () => {
    const setError = vi.fn();
    render(
      <TextFieldInput
        value=''
        error='Something went wrong'
        setValue={vi.fn()}
        setError={setError}
      />,
    );
    fireEvent.focus(screen.getByRole('textbox'));
    expect(setError).toHaveBeenCalledWith(null);
  });

  it('input has rounded-[10px] class (radius token)', () => {
    render(
      <TextFieldInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    const input = document.querySelector('input');
    expect(input?.className).toContain('rounded-[10px]');
  });

  it('input has h-[46px] class (height token)', () => {
    render(
      <TextFieldInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    const input = document.querySelector('input');
    expect(input?.className).toContain('h-[46px]');
  });

  it('input has bg-gray class (background token)', () => {
    render(
      <TextFieldInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    const input = document.querySelector('input');
    expect(input?.className).toContain('bg-gray');
  });

  it('error message is rendered below the field, not inside the input', () => {
    render(
      <TextFieldInput
        value=''
        error='Required field'
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    const errorMsg = screen.getByText('Required field');
    expect(errorMsg.tagName).not.toBe('INPUT');
    expect(errorMsg.closest('p')).toBeInTheDocument();
  });

  it('password type renders a toggle button', () => {
    render(
      <TextFieldInput
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        type='password'
      />,
    );
    expect(
      screen.getByRole('button', { name: /show password/i }),
    ).toBeInTheDocument();
  });

  it('isValidated prop: shows trailing icon when true and no error', () => {
    render(
      <TextFieldInput
        value='test'
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
        isValidated={true}
      />,
    );
    // The checkCircle icon span is rendered as a trailing icon
    const wrapper = document.querySelector('.relative');
    expect(wrapper?.querySelector('span.absolute')).toBeInTheDocument();
  });

  it('renders name attribute when provided', () => {
    render(
      <TextFieldInput
        name='email-field'
        value=''
        error={null}
        setValue={vi.fn()}
        setError={vi.fn()}
      />,
    );
    expect(
      document.querySelector("input[name='email-field']"),
    ).toBeInTheDocument();
  });
});
