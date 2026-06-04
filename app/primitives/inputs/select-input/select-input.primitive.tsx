import React, { forwardRef } from 'react';
import Icon from '~/primitives/icon';
import { cn } from '~/lib/utils';
import {
  formControlBaseStyles,
  formControlFocusStyles,
  formControlErrorStyles,
  formLabelStyles,
  formErrorMessageStyles,
} from '~/primitives/inputs/form-control.styles';

export { defaultSelectInputStyles } from '~/primitives/inputs/form-control.styles';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  name?: string;
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      name,
      className = '',
      value,
      error,
      setValue,
      setError,
      options,
      placeholder = '',
      label,
      isRequired = false,
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
        <div className='relative'>
          {error ? (
            <select
              ref={ref}
              name={name}
              className={cn(formControlErrorStyles, 'appearance-none pr-10')}
              value={value}
              onFocus={() => setError(null)}
              required={isRequired}
              data-invalid={!!error}
            >
              {placeholder && <option value=''>{placeholder}</option>}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <select
              ref={ref}
              name={name}
              className={cn(
                formControlBaseStyles,
                formControlFocusStyles,
                'appearance-none pr-10',
                className,
              )}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required={isRequired}
              data-invalid={!!error}
            >
              {placeholder && <option value=''>{placeholder}</option>}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>
            <Icon name='chevronDown' size={20} />
          </span>
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

SelectInput.displayName = 'SelectInput';

export default SelectInput;
