/**
 * @name TextFieldInput
 * @description This component is a text input field that can be used in forms. It was mainly created inorder to be able to place icons inside the input field when there is an error. If icon is not needed, a normal text input field can be used with the defaultTextInputStyles.
 */

import React, {
  forwardRef,
  HTMLInputTypeAttribute,
  useEffect,
  useRef,
  useState,
} from 'react';
import Icon from '~/primitives/icon';
import { cn } from '~/lib/utils';
import {
  formControlBaseStyles,
  formControlFocusStyles,
  formControlErrorStyles,
  formControlLeadingIconStyles,
  formControlTrailingIconStyles,
  formLabelStyles,
  formErrorMessageStyles,
} from '~/primitives/inputs/form-control.styles';

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
  isRequired?: boolean;
  customIcon?: React.ReactNode;
  isValidated?: boolean;
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
      isRequired = false,
      customIcon,
      isValidated = false,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      if (error === null && inputRef.current) {
        inputRef.current.focus();
      }
    }, [error]);

    const hasLeadingIcon = type === 'email' || type === 'tel' || !!customIcon;
    const isPassword = type === 'password';
    const hasTrailingIcon = isPassword || (isValidated && !error);
    const resolvedType = isPassword && showPassword ? 'text' : type;

    const mergedRef = (el: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    return (
      <div className='flex flex-col gap-1 w-full'>
        {label && (
          <label className={formLabelStyles}>
            {isRequired && <span className='text-ocean mr-1'>{'*'}</span>}
            {label}
            {isRequired && (
              <span className='font-normal text-navy ml-1 italic'>
                {'(required)'}
              </span>
            )}
          </label>
        )}
        <div className='relative'>
          {error ? (
            <input
              ref={mergedRef}
              className={cn(
                formControlErrorStyles,
                hasLeadingIcon && formControlLeadingIconStyles,
                hasTrailingIcon && formControlTrailingIconStyles,
              )}
              type={resolvedType}
              name={name}
              value={value}
              placeholder={placeholder}
              required={isRequired}
              onFocus={() => setError(null)}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : (
            <input
              ref={mergedRef}
              name={name}
              className={cn(
                formControlBaseStyles,
                formControlFocusStyles,
                hasLeadingIcon && formControlLeadingIconStyles,
                hasTrailingIcon && formControlTrailingIconStyles,
                className,
              )}
              type={resolvedType}
              value={value}
              placeholder={placeholder}
              onChange={(e) => setValue(e.target.value)}
              required={isRequired}
            />
          )}
          {/* Leading icons */}
          {type === 'email' && (
            <span className='absolute left-3 top-1/2 -translate-y-1/2'>
              <Icon name='envelope' className='text-navy size-5 mt-[1px]' />
            </span>
          )}
          {type === 'tel' && (
            <span className='absolute left-3 top-1/2 -translate-y-1/2'>
              <Icon name='smartphone' className='text-navy size-5' />
            </span>
          )}
          {customIcon && (
            <span className='absolute left-3 top-1/2 -translate-y-1/2'>
              {customIcon}
            </span>
          )}
          {/* Trailing icons */}
          {isPassword && (
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2'
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                name={showPassword ? 'eyeSlash' : 'eye'}
                className='text-navy size-5'
              />
            </button>
          )}
          {!isPassword && isValidated && !error && (
            <span className='absolute right-3 top-1/2 -translate-y-1/2'>
              <Icon name='checkCircle' className='text-success size-5' />
            </span>
          )}
        </div>
        {error && (
          <p className={formErrorMessageStyles}>
            <Icon name='errorCircle' className='shrink-0' size={20} />
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextFieldInput.displayName = 'TextFieldInput';

export default TextFieldInput;
