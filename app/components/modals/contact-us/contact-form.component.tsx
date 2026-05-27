import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from 'react';
import { Button } from '~/primitives/button/button.primitive';
import { defaultTextInputStyles } from '~/primitives/inputs/text-field/text-field.primitive';
import { useFetcher } from 'react-router-dom';
import { ContactUsLoaderReturnType } from '~/routes/contact-us/types';
import { pushFormEvent } from '~/lib/gtm';

interface ContactUsFormProps {
  onSuccess: () => void;
}

const ContactUsForm: React.FC<ContactUsFormProps> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fetcher = useFetcher();

  const [campuses, setCampuses] = useState<
    ContactUsLoaderReturnType['campuses']
  >([]);

  useEffect(() => {
    fetcher.load('/contact-us');
  }, []);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setLoading(false);

      if ('campuses' in fetcher.data) {
        setCampuses((fetcher.data as ContactUsLoaderReturnType).campuses);
      } else if ('error' in fetcher.data) {
        setError(fetcher.data.error || 'An unexpected error occurred');
      } else {
        setError(null);
        pushFormEvent('form_complete', 'contact_us', 'Contact Us');
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
        action: '/contact-us',
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
      <h2 className='mb-6 text-3xl text-navy font-bold'>Contact Us</h2>
      <p className='mb-10 text-pretty text-center'>
        With a lot of locations it’s easy to feel lost in the shuffle, so we’ve
        made a point to personally answer every question, comment, or prayer
        request you send us. <br /> <br /> We look forward to hearing from you!
      </p>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2'
      >
        <Form.Field name='firstName' className='flex flex-col mb-4'>
          <Form.Label className='font-bold text-sm mb-2'>First Name</Form.Label>
          <Form.Control asChild>
            <input type='text' required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className='text-sm text-alert' match='valueMissing'>
            Please enter your first name
          </Form.Message>
        </Form.Field>

        <Form.Field name='lastName' className='flex flex-col mb-4'>
          <Form.Label className='font-bold text-sm mb-2'>Last Name</Form.Label>
          <Form.Control asChild>
            <input type='text' required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className='text-sm text-alert' match='valueMissing'>
            Please enter your last name
          </Form.Message>
        </Form.Field>

        <Form.Field name='phone' className='flex flex-col mb-4'>
          <Form.Label className='font-bold text-sm mb-2'>Cell Phone</Form.Label>
          <Form.Control asChild>
            <input type='tel' required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className='text-sm text-alert' match='valueMissing'>
            Please enter your phone number
          </Form.Message>
        </Form.Field>

        <Form.Field name='email' className='flex flex-col mb-4'>
          <Form.Label className='font-bold text-sm mb-2'>
            Email Address
          </Form.Label>
          <Form.Control asChild>
            <input type='email' required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className='text-sm text-alert' match='valueMissing'>
            Please enter your email address
          </Form.Message>
          <Form.Message className='text-sm text-alert' match='typeMismatch'>
            Please enter a valid email address
          </Form.Message>
        </Form.Field>

        <Form.Field name='campus' className='flex flex-col mb-4 md:col-span-2'>
          <Form.Label className='font-bold text-sm mb-2'>Location</Form.Label>
          <Form.Control asChild>
            {campuses && (
              <select
                className={`appearance-none ${defaultTextInputStyles}`}
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
          <Form.Message className='text-sm text-alert' match='valueMissing'>
            Please select a campus
          </Form.Message>
        </Form.Field>

        <Form.Field name='message' className='flex flex-col mb-4 md:col-span-2'>
          <Form.Label className='font-bold text-sm mb-2'>Message</Form.Label>
          <Form.Control asChild>
            <textarea required rows={5} className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className='text-sm text-alert' match='valueMissing'>
            Please enter a message
          </Form.Message>
        </Form.Field>

        <Form.Field
          name='smsConsent'
          className='flex flex-col md:col-span-2 mt-2'
        >
          <div className='flex gap-2 items-start'>
            <Form.Control asChild>
              <input type='checkbox' required className='mt-1 shrink-0' />
            </Form.Control>
            <Form.Label className='text-sm text-text-secondary leading-5'>
              By submitting, you agree to our{' '}
              <a
                href='https://www.christfellowship.church/terms-of-use'
                target='_blank'
                rel='noopener noreferrer'
                className='underline'
              >
                Terms of Use
              </a>{' '}
              and{' '}
              <a
                href='https://www.christfellowship.church/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='underline'
              >
                Privacy Policy
              </a>
              . I agree to receive communications by text message about my
              inquiry. You may opt-out by replying STOP or REMOVE or ask for
              more information by replying HELP. Message frequency varies
              depending on your activities. Message and data rates may apply.
              You may review our{' '}
              <a
                href='https://www.christfellowship.church/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='underline'
              >
                Privacy Policy
              </a>{' '}
              to learn how your data is used.
            </Form.Label>
          </div>
          <Form.Message
            className='text-sm text-alert pl-5'
            match='valueMissing'
          >
            You must agree to continue
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

export default ContactUsForm;
