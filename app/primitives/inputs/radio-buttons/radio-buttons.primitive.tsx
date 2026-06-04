import React from 'react';
import { cn } from '~/lib/utils';

interface RadioButtonsProps {
  options: { value: string; label: string }[];
  orientation?: 'vertical' | 'horizontal';
  selectedOption: string;
  onChange: (value: string) => void;
  name?: string;
  error?: boolean;
  disabled?: boolean;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({
  options,
  orientation = 'horizontal',
  selectedOption,
  onChange,
  name = 'option',
  error = false,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div
      className={
        orientation === 'horizontal'
          ? 'flex flex-row gap-4'
          : 'flex flex-col gap-2.5'
      }
    >
      {options.map((option) => {
        const isSelected = selectedOption === option.value;

        const outerCircleClass = cn(
          'flex h-5 w-5 items-center justify-center rounded-full border-2 transition duration-200',
          isSelected && !disabled && 'border-ocean bg-white',
          isSelected && disabled && 'border-ocean/40 bg-white',
          !isSelected && error && 'border-alert bg-white',
          !isSelected && !error && 'border-form-stroke-muted bg-white',
        );

        const innerDotClass = cn(
          'h-3 w-3 rounded-full',
          disabled ? 'bg-ocean/40' : 'bg-ocean',
          isSelected ? '' : 'hidden',
        );

        return (
          <label
            key={option.value}
            className={cn(
              'flex items-center gap-2',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            <input
              type='radio'
              name={name}
              value={option.value}
              className='hidden'
              checked={isSelected}
              onChange={handleChange}
              id={`${name}-${option.value}`}
              disabled={disabled}
            />
            <span className={outerCircleClass}>
              <span className={innerDotClass} />
            </span>
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioButtons;
