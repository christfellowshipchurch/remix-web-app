import React from 'react';
import { cn } from '~/lib/utils';
import {
  formCheckboxControlErrorStyles,
  formCheckboxControlStyles,
  formCheckboxLabelDisabledStyles,
  formCheckboxLabelStyles,
} from '~/primitives/inputs/form-control.styles';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = '',
  labelClassName = '',
  required = false,
  disabled = false,
  error = false,
  id,
}) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer select-none items-center gap-2',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <span className='relative flex items-center justify-center'>
        <input
          id={id}
          type='checkbox'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={cn(
            formCheckboxControlStyles,
            error && formCheckboxControlErrorStyles,
          )}
          aria-checked={checked}
          aria-invalid={error}
          required={required}
          disabled={disabled}
        />
        <span
          className={cn(
            'pointer-events-none absolute left-0 top-0 flex size-5 items-center justify-center transition-opacity duration-150',
            checked ? 'opacity-100' : 'opacity-0',
          )}
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M5 10.5L9 14L15 7'
              stroke='white'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </span>
      </span>
      <span
        className={cn(
          disabled ? formCheckboxLabelDisabledStyles : formCheckboxLabelStyles,
          labelClassName,
        )}
      >
        {label}
      </span>
    </label>
  );
};
