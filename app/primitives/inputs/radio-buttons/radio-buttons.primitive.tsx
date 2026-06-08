import { cn } from '~/lib/utils';
import {
  formRadioControlInnerSelectedStyles,
  formRadioControlInnerStyles,
  formRadioControlInnerUnselectedStyles,
  formRadioControlOuterDisabledStyles,
  formRadioControlOuterErrorStyles,
  formRadioControlOuterSelectedStyles,
  formRadioControlOuterStyles,
  formRadioControlOuterUnselectedStyles,
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
              'flex cursor-pointer select-none items-center gap-2',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <input
              type='radio'
              id={inputId}
              name={name}
              value={option.value}
              className='sr-only'
              checked={isSelected}
              onChange={handleChange}
              disabled={disabled}
              aria-invalid={error}
            />
            <span
              className={cn(
                formRadioControlOuterStyles,
                isSelected
                  ? formRadioControlOuterSelectedStyles
                  : formRadioControlOuterUnselectedStyles,
                error && formRadioControlOuterErrorStyles,
                disabled && formRadioControlOuterDisabledStyles,
              )}
            >
              <span
                className={cn(
                  formRadioControlInnerStyles,
                  isSelected
                    ? formRadioControlInnerSelectedStyles
                    : formRadioControlInnerUnselectedStyles,
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
