import React from 'react';
import { cn } from '~/lib/utils';

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
  const visualCheckboxClass = cn(
    'rounded-md size-5 transition-colors duration-150 border-2',
    checked && !disabled && 'bg-ocean border-ocean',
    checked && disabled && 'bg-ocean/40 border-ocean/40',
    !checked && error && 'bg-white border-alert',
    !checked && !error && 'bg-white border-form-stroke-muted',
  );

  return (
    <label
      className={cn(
        'flex items-center gap-3 select-none',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <span className='relative flex items-center justify-center'>
        <input
          type='checkbox'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className='peer appearance-none w-5 h-5 focus:outline-none focus:ring-1 focus:ring-ocean'
          aria-checked={checked}
          required={required}
          disabled={disabled}
          id={id}
        />
        <span
          className={cn(
            'pointer-events-none absolute left-0 top-0 flex h-5 w-5 items-center justify-center',
            visualCheckboxClass,
          )}
        >
          <span
            className={cn(
              'flex items-center justify-center transition-opacity duration-150',
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
      </span>
      <span
        className={
          labelClassName && labelClassName !== ''
            ? labelClassName
            : 'text-dark-navy font-normal'
        }
      >
        {label}
      </span>
    </label>
  );
};
