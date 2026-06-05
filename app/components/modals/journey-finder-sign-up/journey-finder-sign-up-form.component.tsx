import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from 'react';
import { useFetcher, useSearchParams } from 'react-router-dom';
import { Button } from '~/primitives/button/button.primitive';
import { pushFormEvent } from '~/lib/gtm';
import Icon from '~/primitives/icon';
import { cn } from '~/lib/utils';
import { formRadioGroupVerticalStyles } from '~/primitives/inputs/form-control.styles';
import {
  radixFormFieldStackClassName,
  radixFormLabelClassName,
  radixRadioClassName,
  radixTextareaClassName,
  renderRadixInputField,
  RadixFormErrorMessage,
} from '~/primitives/inputs/form-radix-field';

export type JourneyFinderSignUpSuccessDetails = {
  firstName: string;
  lastName: string;
};

interface JourneyFinderSignUpFormProps {
  onSuccess: (details?: JourneyFinderSignUpSuccessDetails) => void;
  groupGuid?: string;
  isSpanish?: boolean;
}

export const renderInputField = renderRadixInputField;

const AT_CF_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Less than 1 month' },
  { value: '2', label: '1-6 months' },
  { value: '3', label: '7-12 months' },
  { value: '4', label: '1-5 years' },
  { value: '5', label: 'Over 5 years' },
];

const SPANISH_AT_CF_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Menos de 1 mes' },
  { value: '2', label: '1-6 meses' },
  { value: '3', label: '7-12 meses' },
  { value: '4', label: '1-5 años' },
  { value: '5', label: 'Más de 5 años' },
];

const FORM_COPY = {
  English: {
    cardHeading: 'Personal Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Cell Phone',
    email: 'Email Address',
    atCF: 'How long have you attended Christ Fellowship?',
    hopeToGet: 'What do you hope to gain from this Journey Experience?',
    submit: 'Submit',
    loading: 'Loading...',
    missingGroup: 'Missing group reference. Please use the link provided.',
    requiredFirstName: 'Please enter your first name',
    requiredLastName: 'Please enter your last name',
    requiredPhone: 'Please enter a valid number',
    requiredEmail: 'Please enter a valid email',
    requiredAtCF: 'Please select an option',
    atCFOptions: AT_CF_OPTIONS,
  },
  Spanish: {
    cardHeading: 'Información personal',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono celular',
    email: 'Correo electrónico',
    atCF: '¿Cuánto tiempo has asistido a Christ Fellowship?',
    hopeToGet: '¿Qué esperas recibir de esta experiencia de Journey?',
    submit: 'Enviar',
    loading: 'Cargando...',
    missingGroup:
      'Falta la referencia del grupo. Por favor usa el enlace proporcionado.',
    requiredFirstName: 'Por favor ingresa tu nombre',
    requiredLastName: 'Por favor ingresa tu apellido',
    requiredPhone: 'Por favor ingresa un número válido',
    requiredEmail: 'Por favor ingresa un correo electrónico válido',
    requiredAtCF: 'Por favor selecciona una opción',
    atCFOptions: SPANISH_AT_CF_OPTIONS,
  },
};

const JourneyFinderSignUpForm: React.FC<JourneyFinderSignUpFormProps> = ({
  onSuccess,
  groupGuid,
  isSpanish = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedName, setSubmittedName] =
    useState<JourneyFinderSignUpSuccessDetails | null>(null);
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();
  const selectedGroupGuid = groupGuid ?? searchParams.get('Group') ?? '';
  const language = isSpanish ? 'Spanish' : 'English';
  const copy = FORM_COPY[language];

  useEffect(() => {
    fetcher.load('/journey-finder-sign-up');
  }, []);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setLoading(false);

      if ('error' in fetcher.data) {
        setError(fetcher.data.error || 'An unexpected error occurred');
      } else if ('success' in fetcher.data) {
        setError(null);
        pushFormEvent(
          'form_complete',
          'journey_finder_sign_up',
          'Journey Finder Sign Up',
        );
        onSuccess(submittedName ?? undefined);
      }
    }

    if (fetcher.state === 'submitting') {
      setLoading(true);
      setError(null);
    }
  }, [fetcher.state, fetcher.data, onSuccess, submittedName]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedGroupGuid) {
      setError(copy.missingGroup);
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmittedName({
      firstName: formData.get('firstName')?.toString() ?? '',
      lastName: formData.get('lastName')?.toString() ?? '',
    });
    const actionSearchParams = new URLSearchParams({
      Group: selectedGroupGuid,
      Language: language,
    });

    try {
      fetcher.submit(formData, {
        method: 'post',
        action: `/journey-finder-sign-up?${actionSearchParams.toString()}`,
      });
    } catch {
      setError(
        'An error occurred while submitting the form. Please try again.',
      );
      setLoading(false);
    }
  };

  return (
    <div className='w-full rounded-xl border border-neutral-lighter bg-white p-6 shadow-sm md:p-8'>
      <div className='mb-6 flex items-center gap-2 text-black'>
        <Icon name='user' size={16} className='text-black' />
        <h2 className='text-sm font-extrabold'>{copy.cardHeading}</h2>
      </div>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2'
      >
        {renderInputField(
          'firstName',
          copy.firstName,
          'text',
          copy.requiredFirstName,
        )}
        {renderInputField(
          'lastName',
          copy.lastName,
          'text',
          copy.requiredLastName,
        )}
        {renderInputField('phone', copy.phone, 'tel', copy.requiredPhone)}
        {renderInputField('email', copy.email, 'email', copy.requiredEmail)}

        <Form.Field
          name='atCF'
          className={cn('col-span-1 mt-2 md:col-span-2', radixFormFieldStackClassName)}
        >
          <Form.Label className={radixFormLabelClassName}>
            {copy.atCF}
          </Form.Label>
          <div className={formRadioGroupVerticalStyles}>
            {copy.atCFOptions.map((option) => (
              <label key={option.value} className='flex items-center gap-2'>
                <Form.Control asChild>
                  <input
                    type='radio'
                    name='atCF'
                    value={option.value}
                    required
                    className={radixRadioClassName}
                  />
                </Form.Control>
                <span className='leading-4'>{option.label}</span>
              </label>
            ))}
          </div>
          <RadixFormErrorMessage match='valueMissing'>
            {copy.requiredAtCF}
          </RadixFormErrorMessage>
        </Form.Field>

        <Form.Field
          name='hopeToGet'
          className={cn('col-span-1 mt-2 md:col-span-2', radixFormFieldStackClassName)}
        >
          <Form.Label className={radixFormLabelClassName}>
            {copy.hopeToGet}
          </Form.Label>
          <Form.Control asChild>
            <textarea rows={4} className={radixTextareaClassName} />
          </Form.Control>
        </Form.Field>

        <input type='hidden' name='Group' value={selectedGroupGuid} />

        {error && (
          <p className='text-alert col-span-1 md:col-span-2 text-center'>
            {error}
          </p>
        )}

        <Form.Submit className='mt-6 mx-auto col-span-1 md:col-span-2' asChild>
          <Button
            className='w-full h-12'
            size='md'
            type='submit'
            disabled={loading}
          >
            {loading ? copy.loading : copy.submit}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default JourneyFinderSignUpForm;
