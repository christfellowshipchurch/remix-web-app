import React, { forwardRef } from 'react';
import Icon from '~/primitives/icon';
import { cn } from '~/lib/utils';
import {
  formControlBaseStyles,
  formControlFocusStyles,
  formControlErrorStyles,
  formLabelStyles,
  formHelperTextStyles,
  formErrorMessageStyles,
} from '~/primitives/inputs/form-control.styles';

interface TextareaInputProps {
  name?: string;
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  rows?: number;
  helperText?: string;
}

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
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
      isRequired = false,
      rows,
      helperText,
    },
    ref,
  ) => {
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
          <textarea
            ref={ref}
            name={name}
            className={cn(formControlErrorStyles, 'min-h-[120px] h-auto')}
            value={value}
            placeholder={placeholder}
            onFocus={() => setError(null)}
            onChange={(e) => setValue(e.target.value)}
            required={isRequired}
            rows={rows}
          />
        ) : (
          <textarea
            ref={ref}
            name={name}
            className={cn(
              formControlBaseStyles,
              formControlFocusStyles,
              'min-h-[120px] h-auto',
              className,
            )}
            value={value}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
            required={isRequired}
            rows={rows}
          />
        )}
        {helperText && <p className={formHelperTextStyles}>{helperText}</p>}
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

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
