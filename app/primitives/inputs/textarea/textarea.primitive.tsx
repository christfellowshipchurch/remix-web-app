import React, { forwardRef } from 'react';
import { cn } from '~/lib/utils';
import {
  formFieldStackStyles,
  formHelperTextStyles,
  formLabelStyles,
  formRequiredHintStyles,
  formRequiredMarkerStyles,
  formTextareaBaseStyles,
  formTextareaErrorStyles,
} from '~/primitives/inputs/form-control.styles';
import { FormFieldErrorText } from '~/primitives/inputs/form-error-message';

interface TextareaInputProps {
  name?: string;
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  rows?: number;
  disabled?: boolean;
}

const TextareaInput = forwardRef<
  React.ComponentRef<'textarea'>,
  TextareaInputProps
>(
  (
    {
      name,
      className = '',
      value,
      error,
      setValue,
      setError,
      placeholder = '',
      label,
      helperText,
      isRequired = false,
      rows = 4,
      disabled = false,
    },
    ref,
  ) => {
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
        {helperText && !error && (
          <p className={formHelperTextStyles}>{helperText}</p>
        )}
        <textarea
          ref={ref}
          name={name}
          className={cn(
            error ? formTextareaErrorStyles : formTextareaBaseStyles,
            className,
          )}
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => error && setError(null)}
          required={isRequired}
          disabled={disabled}
          rows={rows}
          data-invalid={Boolean(error)}
          aria-invalid={Boolean(error)}
        />
        {error && <FormFieldErrorText>{error}</FormFieldErrorText>}
      </div>
    );
  },
);

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
