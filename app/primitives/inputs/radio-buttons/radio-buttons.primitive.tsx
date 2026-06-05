import { cn } from '~/lib/utils';
import {
  formRadioControlInnerSelectedStyles,
  formRadioGroupHorizontalStyles,
  formRadioGroupVerticalStyles,
  formRadioLabelStyles,
} from '~/primitives/inputs/form-control.styles';

interface RadioButtonsProps {
  options: { value: string; label: string }[];
  orientation?: 'vertical' | 'horizontal';
  selectedOption: string;
  onChange: (value: string) => void;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({
  options,
  orientation = 'horizontal',
  selectedOption,
  onChange,
  name = 'option',
  disabled = false,
  error = false,
  className = '',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div
      className={cn(
        orientation === 'horizontal'
          ? formRadioGroupHorizontalStyles
          : formRadioGroupVerticalStyles,
        className,
      )}
      role='radiogroup'
      aria-invalid={error}
    >
      {options.map((option) => {
        const inputId = `${name}-${option.value}`;
        const isSelected = selectedOption === option.value;

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={cn(
              'flex cursor-pointer items-center gap-2',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <input
              type='radio'
              id={inputId}
              name={name}
              value={option.value}
              className='peer sr-only'
              checked={isSelected}
              onChange={handleChange}
              disabled={disabled}
              aria-invalid={error}
            />
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white transition duration-200',
                isSelected ? 'border-ocean' : 'border-form-stroke-muted',
                error && 'border-alert',
                disabled && 'border-ocean/40 bg-ocean-subdued',
              )}
            >
              <span
                className={cn(
                  'size-3 rounded-full',
                  isSelected ? formRadioControlInnerSelectedStyles : 'hidden',
                )}
              />
            </span>
            <span className={formRadioLabelStyles}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioButtons;
