import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';
import Icon from '~/primitives/icon';
import colors from '~/styles/colors';
import {
  formControlBaseStyles,
  formControlLeadingIconStyles,
  formLabelStyles,
  formRequiredHintStyles,
  formRequiredMarkerStyles,
} from '~/primitives/inputs/form-control.styles';
import { FormFieldErrorText } from '~/primitives/inputs/form-error-message';

interface SecureTextFieldInputProps {
  className?: string;
  name?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
}

const SecureTextFieldInput = forwardRef<
  HTMLInputElement,
  SecureTextFieldInputProps
>(
  (
    {
      className = '',
      name,
      value,
      error,
      setValue,
      placeholder = '***-**-0000',
      label,
      isRequired = false,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [maskedValue, setMaskedValue] = useState('');

    const maskSSN = (rawValue: string) => {
      const len = rawValue.length;
      if (len === 0) return '';

      const last = rawValue.slice(5);

      if (len <= 3) {
        return '*'.repeat(len);
      }
      if (len <= 5) {
        return '***-' + '*'.repeat(len - 3);
      }
      return '***-**-' + last;
    };

    useEffect(() => {
      setMaskedValue(maskSSN(value));
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

      if (['ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(key)) {
        return;
      }

      if (key === 'Backspace') {
        if (value.length > 0) {
          setValue(value.slice(0, -1));
        }
        e.preventDefault();
        return;
      }

      if (!/\d/.test(key)) {
        e.preventDefault();
        return;
      }

      if (value.length < 9) {
        setValue(value + key);
      }

      e.preventDefault();
    };

    return (
      <div className='flex w-full flex-col gap-1'>
        {label && (
          <label className={cn(formLabelStyles, 'mb-1')}>
            {isRequired && (
              <span className={formRequiredMarkerStyles}>{'*'}</span>
            )}
            {label}
            {isRequired && (
              <span className={formRequiredHintStyles}>{'(required)'}</span>
            )}
          </label>
        )}
        <input type='hidden' name={name} value={value} />
        <div className='relative'>
          <input
            ref={(el) => {
              (
                inputRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = el;
              if (typeof ref === 'function') {
                ref(el);
              } else if (ref) {
                ref.current = el;
              }
            }}
            className={cn(
              formControlBaseStyles,
              formControlLeadingIconStyles,
              error && 'border-2 border-alert h-[48px]',
              className,
            )}
            type='text'
            value={maskedValue}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            required={isRequired}
            inputMode='numeric'
            autoComplete='off'
            aria-invalid={Boolean(error)}
          />
          <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2'>
            <Icon name='lockAlt' className='size-5 text-navy' />
          </span>
          {error && (
            <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2'>
              <Icon
                name='errorCircle'
                color={colors.alert}
                className='size-5'
              />
            </span>
          )}
        </div>
        {error && <FormFieldErrorText>{error}</FormFieldErrorText>}
      </div>
    );
  },
);

SecureTextFieldInput.displayName = 'SecureTextFieldInput';

export default SecureTextFieldInput;
