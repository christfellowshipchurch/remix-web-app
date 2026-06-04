import React, { forwardRef } from 'react';
import { cn } from '~/lib/utils';
import Icon from '~/primitives/icon';
import colors from '~/styles/colors';
import {
  defaultSelectInputStyles,
  formControlErrorStyles,
  formLabelStyles,
  formRequiredHintStyles,
  formRequiredMarkerStyles,
} from '~/primitives/inputs/form-control.styles';
import { FormFieldErrorText } from '~/primitives/inputs/form-error-message';

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
  disabled?: boolean;
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
      disabled = false,
    },
    ref,
  ) => {
    return (
      <div className='relative flex w-full flex-col gap-1'>
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
        <div className='relative'>
          <select
            ref={ref}
            name={name}
            className={cn(
              error ? formControlErrorStyles : defaultSelectInputStyles,
              'appearance-none pr-10',
              className,
            )}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => error && setError(null)}
            required={isRequired}
            disabled={disabled}
            data-invalid={Boolean(error)}
            aria-invalid={Boolean(error)}
          >
            {placeholder && <option value=''>{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500'>
            <Icon name='chevronDown' size={20} />
          </span>
          {error && (
            <span className='pointer-events-none absolute right-10 top-1/2 -translate-y-1/2'>
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

SelectInput.displayName = 'SelectInput';

export default SelectInput;
