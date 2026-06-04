import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '~/lib/utils';
import Icon from '~/primitives/icon';
import colors from '~/styles/colors';
import {
  formControlBaseStyles,
  formControlErrorStyles,
  formFieldStackStyles,
  formLabelStyles,
  formRequiredHintStyles,
  formRequiredMarkerStyles,
} from '~/primitives/inputs/form-control.styles';
import { FormFieldErrorText } from '~/primitives/inputs/form-error-message';

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
  disabled?: boolean;
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
      disabled = false,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

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

    return (
      <div className={cn('w-full', formFieldStackStyles)}>
        {label && (
          <label className={formLabelStyles}>
            {isRequired && (
              <span className={formRequiredMarkerStyles}>{'*'}</span>
            )}
            {label}
            {isRequired && (
              <span className={formRequiredHintStyles}>{'(required)'}</span>
            )}
          </label>
        )}
        <div className='relative'>
          <input
            ref={assignRef}
            name={name}
            className={cn(
              error ? formControlErrorStyles : formControlBaseStyles,
              className,
            )}
            type='date'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => error && setError(null)}
            required={isRequired}
            disabled={disabled}
            min={min}
            max={max}
            data-invalid={Boolean(error)}
            aria-invalid={Boolean(error)}
          />
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

DateInput.displayName = 'DateInput';

export default DateInput;
