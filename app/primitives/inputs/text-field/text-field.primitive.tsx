/**
 * @name TextFieldInput
 * @description Text input with icon slots, password toggle, and validation states.
 */

import React, {
  forwardRef,
  HTMLInputTypeAttribute,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '~/lib/utils';
import Icon from '~/primitives/icon';
import colors from '~/styles/colors';
import {
  formControlBaseStyles,
  formControlErrorStyles,
  formControlLeadingIconStyles,
  formControlTrailingIconStyles,
  formHelperTextStyles,
  formLabelStyles,
  formRequiredHintStyles,
  formRequiredMarkerStyles,
} from '~/primitives/inputs/form-control.styles';
import { FormFieldErrorText } from '~/primitives/inputs/form-error-message';

export { defaultTextInputStyles } from '~/primitives/inputs/form-control.styles';

interface TextFieldInputProps {
  name?: string;
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  isValidated?: boolean;
  customIcon?: React.ReactNode;
  disabled?: boolean;
}

const TextFieldInput = forwardRef<HTMLInputElement, TextFieldInputProps>(
  (
    {
      name,
      className = '',
      value,
      error,
      setValue,
      setError,
      type = 'text',
      placeholder = '',
      label,
      helperText,
      isRequired = false,
      isValidated = false,
      customIcon,
      disabled = false,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const hasLeadingIcon =
      type === 'email' || type === 'tel' || Boolean(customIcon);
    const hasTrailingIcon = isPassword || isValidated || Boolean(error);

    useEffect(() => {
      if (error === null && inputRef.current) {
        inputRef.current.focus();
      }
    }, [error]);

    const assignRef = (el: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    const paddingClasses = cn(
      hasLeadingIcon && formControlLeadingIconStyles,
      hasTrailingIcon && formControlTrailingIconStyles,
    );

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
        {helperText && !error && (
          <p className={formHelperTextStyles}>{helperText}</p>
        )}
        <div className='relative'>
          <input
            ref={assignRef}
            name={name}
            className={cn(
              error ? formControlErrorStyles : formControlBaseStyles,
              paddingClasses,
              className,
            )}
            type={inputType}
            value={value}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => error && setError(null)}
            required={isRequired}
            disabled={disabled}
            data-invalid={Boolean(error)}
            aria-invalid={Boolean(error)}
          />
          {type === 'email' && !error && (
            <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2'>
              <Icon name='envelope' className='size-5 text-navy' />
            </span>
          )}
          {type === 'tel' && !error && (
            <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2'>
              <Icon name='smartphone' className='size-5 text-navy' />
            </span>
          )}
          {customIcon && !error && (
            <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2'>
              {customIcon}
            </span>
          )}
          {isPassword && !error && (
            <button
              type='button'
              className='absolute right-4 top-1/2 -translate-y-1/2 text-navy'
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              <Icon
                name={showPassword ? 'eyeSlash' : 'eye'}
                className='size-5'
              />
            </button>
          )}
          {isValidated && !error && !isPassword && (
            <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2'>
              <Icon
                name='checkCircle'
                color={colors.success}
                className='size-5'
              />
            </span>
          )}
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

TextFieldInput.displayName = 'TextFieldInput';

export default TextFieldInput;
