import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import { pushFormEvent } from '~/lib/gtm';
import { Button } from '~/primitives/button/button.primitive';
import {
  formControlBaseStyles,
  formControlFocusStyles,
  formErrorMessageStyles,
  formLabelStyles,
} from '~/primitives/inputs/form-control.styles';
import { cn } from '~/lib/utils';
import { NewsletterSubscriptionLoaderReturnType } from '~/routes/newsletter-subscription/types';

interface NewsletterSubscriptionFormProps {
  onSuccess: () => void;
}

export const renderInputField = (
  name: string,
  label: string,
  type: string,
  requiredMessage: string,
) => (
  <Form.Field name={name} className='flex flex-col mb-4 group'>
    <Form.Label className={formLabelStyles}>{label}</Form.Label>
    <Form.Control asChild>
      <input
        type={type}
        required
        className={cn(formControlBaseStyles, formControlFocusStyles)}
      />
    </Form.Control>
    <Form.Message className={formErrorMessageStyles} match='valueMissing'>
      {requiredMessage}
    </Form.Message>
    {type === 'email' && (
      <Form.Message className={formErrorMessageStyles} match='typeMismatch'>
        Please enter a valid email address
      </Form.Message>
    )}
  </Form.Field>
);

const NewsletterSubscriptionForm: React.FC<NewsletterSubscriptionFormProps> = ({
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<
    NewsletterSubscriptionLoaderReturnType['campuses']
  >([]);
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.load('/newsletter-subscription');
  }, []);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setLoading(false);

      if ('campuses' in fetcher.data) {
        setCampuses(
          (fetcher.data as NewsletterSubscriptionLoaderReturnType).campuses,
        );
      } else if ('error' in fetcher.data) {
        setError(fetcher.data.error || 'An unexpected error occurred');
      } else {
        setError(null);
        pushFormEvent(
          'form_complete',
          'newsletter_subscription',
          'Newsletter Subscription',
        );
        onSuccess();
      }
    }

    if (fetcher.state === 'submitting') {
      setLoading(true);
      setError(null);
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      fetcher.submit(formData, {
        method: 'post',
        action: '/newsletter-subscription',
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
        Subscribe to Updates
      </h2>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2'
      >
        {renderInputField(
          'FirstName',
          'First Name',
          'text',
          'Please enter your first name',
        )}
        {renderInputField(
          'LastName',
          'Last Name',
          'text',
          'Please enter your last name',
        )}
        {renderInputField(
          'PhoneNumber',
          'Phone',
          'tel',
          'Please enter your phone number',
        )}
        {renderInputField(
          'EmailAddress',
          'Email Address',
          'email',
          'Please enter your email address',
        )}

        <Form.Field name='Campus' className='flex flex-col mb-4 md:col-span-2 group'>
          <Form.Label className={formLabelStyles}>Campus Location</Form.Label>
          <Form.Control asChild>
            {campuses && (
              <select
                className={cn(
                  'appearance-none',
                  formControlBaseStyles,
                  formControlFocusStyles,
                )}
                required
                style={{
                  backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                  backgroundSize: '24px',
                  backgroundPosition: 'calc(100% - 2%) center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <option value=''>Select a Campus</option>
                {campuses.map(({ guid, name }, index) => (
                  <option key={index} value={guid}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </Form.Control>
          <Form.Message className={formErrorMessageStyles} match='valueMissing'>
            Please select a campus
          </Form.Message>
        </Form.Field>

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

export default NewsletterSubscriptionForm;
