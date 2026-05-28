import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from 'react';
import { useFetcher, useSearchParams } from 'react-router-dom';
import { Button } from '~/primitives/button/button.primitive';
import { defaultTextInputStyles } from '~/primitives/inputs/text-field/text-field.primitive';
import { pushFormEvent } from '~/lib/gtm';

interface JourneyFinderSignUpFormProps {
  onSuccess: () => void;
}

export const renderInputField = (
  name: string,
  label: string,
  type: string,
  requiredMessage: string,
  defaultValue?: string,
) => (
  <Form.Field name={name} className='flex flex-col mb-4'>
    <Form.Label className='font-bold text-sm mb-2'>{label}</Form.Label>
    <Form.Control asChild>
      <input
        type={type}
        required
        defaultValue={defaultValue}
        className={defaultTextInputStyles}
      />
    </Form.Control>
    <Form.Message className='text-sm text-alert' match='valueMissing'>
      {requiredMessage}
    </Form.Message>
  </Form.Field>
);

const AT_CF_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Less than 1 month' },
  { value: '2', label: '1-6 months' },
  { value: '3', label: '7-12 months' },
  { value: '4', label: '1-5 years' },
  { value: '5', label: 'Over 5 years' },
];

const JourneyFinderSignUpForm: React.FC<JourneyFinderSignUpFormProps> = ({
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();
  const groupGuid = searchParams.get('Group') ?? '';

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
        onSuccess();
      }
    }

    if (fetcher.state === 'submitting') {
      setLoading(true);
      setError(null);
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!groupGuid) {
      setError('Missing group reference. Please use the link provided.');
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      fetcher.submit(formData, {
        method: 'post',
        action: `/journey-finder-sign-up?Group=${encodeURIComponent(groupGuid)}`,
      });
    } catch {
      setError(
        'An error occurred while submitting the form. Please try again.',
      );
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className='mb-6 text-3xl text-navy font-bold'>
        Journey Finder Sign Up
      </h2>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2'
      >
        {renderInputField(
          'firstName',
          'First Name',
          'text',
          'Please enter your first name',
        )}
        {renderInputField(
          'lastName',
          'Last Name',
          'text',
          'Please enter your last name',
        )}
        {renderInputField(
          'phone',
          'Cell Phone',
          'tel',
          'Please enter a valid number',
        )}
        {renderInputField(
          'email',
          'Email Address',
          'email',
          'Please enter a valid email',
        )}

        <Form.Field
          name='atCF'
          className='flex flex-col col-span-1 md:col-span-2 mt-2'
        >
          <Form.Label className='font-bold text-sm mb-2'>
            How long have you attended Christ Fellowship?
          </Form.Label>
          <div className='flex flex-col gap-2'>
            {AT_CF_OPTIONS.map((option) => (
              <label key={option.value} className='flex items-center gap-2'>
                <Form.Control asChild>
                  <input
                    type='radio'
                    name='atCF'
                    value={option.value}
                    required
                  />
                </Form.Control>
                <span className='font-bold leading-4'>{option.label}</span>
              </label>
            ))}
          </div>
          <Form.Message className='text-sm text-alert' match='valueMissing'>
            Please select an option
          </Form.Message>
        </Form.Field>

        <Form.Field
          name='hopeToGet'
          className='flex flex-col col-span-1 md:col-span-2 mt-2'
        >
          <Form.Label className='font-bold text-sm mb-2'>
            What do you hope to gain from this Journey Experience?
          </Form.Label>
          <Form.Control asChild>
            <textarea rows={4} className={defaultTextInputStyles} />
          </Form.Control>
        </Form.Field>

        <input type='hidden' name='Group' value={groupGuid} />

        {error && <p className='text-alert col-span-2 text-center'>{error}</p>}

        <Form.Submit className='mt-6 mx-auto col-span-1 md:col-span-2' asChild>
          <Button
            className='w-40 h-12'
            size='md'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </Form.Submit>
      </Form.Root>
    </>
  );
};

export default JourneyFinderSignUpForm;
