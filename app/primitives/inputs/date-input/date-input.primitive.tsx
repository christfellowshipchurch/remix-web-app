import React, { forwardRef, useEffect, useRef } from 'react';
import Icon from '~/primitives/icon';
import { cn } from '~/lib/utils';
import {
  formControlBaseStyles,
  formControlFocusStyles,
  formControlErrorStyles,
  formLabelStyles,
  formErrorMessageStyles,
} from '~/primitives/inputs/form-control.styles';

export { defaultDateInputStyles } from '~/primitives/inputs/form-control.styles';

interface DateInputProps {
  name?: string;
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  label?: string;
  isRequired?: boolean;
  min?: string;
  max?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      name,
      className = '',
      value,
      error,
      setValue,
      setError,
      label,
      isRequired = false,
      min,
      max,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (error === null && inputRef.current) {
        inputRef.current.focus();
      }
    }, [error]);

    const mergedRef = (el: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        el;
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
        {error ? (
          <input
            ref={ref}
            name={name}
            className={formControlErrorStyles}
            type='date'
            value={value}
            onFocus={() => setError(null)}
            onChange={(e) => setValue(e.target.value)}
            required={isRequired}
            min={min}
            max={max}
          />
        ) : (
          <input
            ref={mergedRef}
            name={name}
            className={cn(
              formControlBaseStyles,
              formControlFocusStyles,
              className,
            )}
            type='date'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={isRequired}
            min={min}
            max={max}
          />
        )}
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

DateInput.displayName = 'DateInput';

export default DateInput;
