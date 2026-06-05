import * as Form from '@radix-ui/react-form';
import { cn } from '~/lib/utils';
import Icon from '~/primitives/icon';
import colors from '~/styles/colors';
import { formErrorMessageStyles } from '~/primitives/inputs/form-control.styles';

interface FormFieldErrorTextProps {
  children: React.ReactNode;
  className?: string;
}

export const FormFieldErrorText: React.FC<FormFieldErrorTextProps> = ({
  children,
  className,
}) => (
  <p className={cn(formErrorMessageStyles, className)} role='alert'>
    <Icon
      name='alertCircle'
      color={colors.alert}
      size={20}
      className='shrink-0'
      aria-hidden
    />
    <span>{children}</span>
  </p>
);

interface RadixFormErrorMessageProps {
  children: React.ReactNode;
  match: 'valueMissing' | 'typeMismatch' | 'tooShort' | 'patternMismatch';
  className?: string;
}

export const RadixFormErrorMessage: React.FC<RadixFormErrorMessageProps> = ({
  children,
  match,
  className,
}) => (
  <Form.Message match={match} asChild>
    <FormFieldErrorText className={className}>{children}</FormFieldErrorText>
  </Form.Message>
);
