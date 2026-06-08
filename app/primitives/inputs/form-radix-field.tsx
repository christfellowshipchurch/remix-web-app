import * as Form from '@radix-ui/react-form';
import Icon from '~/primitives/icon';
import {
  defaultSelectInputStyles,
  defaultTextInputStyles,
  formCheckboxOptionLabelStyles,
  formCompactFieldLabelStyles,
  formErrorMessageStyles,
  formFieldInvalidControlStyles,
  formFieldStackStyles,
  formTextareaBaseStyles,
  nativeCheckboxStyles,
  nativeRadioStyles,
} from '~/primitives/inputs/form-control.styles';
import { RadixFormErrorMessage } from '~/primitives/inputs/form-error-message';
import { cn } from '~/lib/utils';

export const radixFormLabelClassName = formCompactFieldLabelStyles;

export const radixCompactFormLabelClassName = formCompactFieldLabelStyles;

export const radixCheckboxOptionLabelClassName = formCheckboxOptionLabelStyles;

/** @deprecated Use RadixFormErrorMessage for validation messages with icon */
export const radixFormMessageClassName = formErrorMessageStyles;

export {
  RadixFormErrorMessage,
  FormFieldErrorText,
} from '~/primitives/inputs/form-error-message';

export const radixInputClassName = defaultTextInputStyles;

export const radixSelectClassName = cn(
  defaultSelectInputStyles,
  'appearance-none',
);

export const radixTextareaClassName = formTextareaBaseStyles;

export const radixFormFieldStackClassName = cn(
  formFieldStackStyles,
  formFieldInvalidControlStyles,
);

export const radixCheckboxClassName = nativeCheckboxStyles;

export const radixRadioClassName = nativeRadioStyles;

/** Wraps a Radix `Form.Control` select so the chevron displays with `appearance-none`. */
export const RadixFormSelectShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className='relative'>
    {children}
    <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy'>
      <Icon name='chevronDown' size={20} />
    </span>
  </div>
);

export const renderRadixInputField = (
  name: string,
  label: string,
  type: string,
  requiredMessage: string,
  defaultValue?: string,
  fieldClassName = '',
) => (
  <Form.Field
    name={name}
    className={cn('mb-4', radixFormFieldStackClassName, fieldClassName)}
  >
    <Form.Label className={radixFormLabelClassName}>{label}</Form.Label>
    <Form.Control asChild>
      <input
        type={type}
        required
        defaultValue={defaultValue}
        className={radixInputClassName}
      />
    </Form.Control>
    <RadixFormErrorMessage match='valueMissing'>
      {requiredMessage}
    </RadixFormErrorMessage>
    {type === 'email' && (
      <RadixFormErrorMessage match='typeMismatch'>
        Please enter a valid email address
      </RadixFormErrorMessage>
    )}
  </Form.Field>
);
