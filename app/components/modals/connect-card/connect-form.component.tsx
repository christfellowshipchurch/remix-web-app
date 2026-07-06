import { useEffect, useState } from 'react';
import { Button } from '~/primitives/button/button.primitive';
import * as Form from '@radix-ui/react-form';
import { cn } from '~/lib/utils';
import {
  RadixFormSelectShell,
  radixCheckboxClassName,
  radixCheckboxOptionLabelClassName,
  radixCompactFormLabelClassName,
  RadixFormErrorMessage,
  radixFormFieldStackClassName,
  radixInputClassName,
  radixSelectClassName,
} from '~/primitives/inputs/form-radix-field';
import { formFieldInvalidControlStyles } from '~/primitives/inputs/form-control.styles';
import { useFetcher } from 'react-router-dom';
import { ConnectCardLoaderReturnType } from '~/routes/connect-card/types';
import { pushFormEvent } from '~/lib/gtm';

interface ConnectCardProps {
  onSuccess: () => void;
}

export const renderInputField = (
  name: string,
  label: string,
  type: string,
  requiredMessage: string,
  defaultValue?: string,
  placeholder?: string,
  fieldClassName = '',
) => (
  <Form.Field
    name={name}
    className={cn('mb-4', radixFormFieldStackClassName, fieldClassName)}
  >
    <Form.Label className={radixCompactFormLabelClassName}>{label}</Form.Label>
    <Form.Control asChild>
      <input
        type={type}
        required
        defaultValue={defaultValue}
        placeholder={placeholder}
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

interface CheckboxOption {
  guid: string;
  value: string;
}

// Options grouped under the "next step in my faith" sub-heading within the
// "I am looking to:" section. Matched by Rock defined-value label, mirroring
// the existing `Other` handling.
const NEXT_STEP_VALUES = ['The Journey class', 'Baptism'];

export const renderCheckboxField = (
  checkbox: CheckboxOption,
  index: number,
) => (
  <Form.Field
    key={index}
    name={`allThatApplies-${index}`}
    className={cn('flex gap-2 md:items-center', formFieldInvalidControlStyles)}
  >
    <Form.Control asChild>
      <input
        type='checkbox'
        id={checkbox.guid}
        value={checkbox.guid}
        className={radixCheckboxClassName}
      />
    </Form.Control>
    <Form.Label
      htmlFor={checkbox.guid}
      className={radixCheckboxOptionLabelClassName}
    >
      {checkbox.value}
    </Form.Label>
  </Form.Field>
);

const ConnectCardForm: React.FC<ConnectCardProps> = ({ onSuccess }) => {
  const [isOther, setIsOther] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fetcher = useFetcher();

  const [formFieldData, setFormFieldData] =
    useState<ConnectCardLoaderReturnType>({
      campuses: [],
      allThatApplies: [],
    });

  // Effect for initial data loading
  useEffect(() => {
    fetcher.load('/connect-card');
  }, []);

  // Effect for handling form data and submissions
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setLoading(false);

      if ('campuses' in fetcher.data && 'allThatApplies' in fetcher.data) {
        // This was the initial data load
        setFormFieldData(fetcher.data as ConnectCardLoaderReturnType);
      } else if ('error' in fetcher.data) {
        setError(fetcher.data.error || 'An unexpected error occurred');
      } else {
        // This was a successful form submission
        setError(null);
        pushFormEvent('form_complete', 'connect_card', 'Connect Card');
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
        action: '/connect-card',
      });
    } catch {
      setError(
        'An error occurred while submitting the form. Please try again.',
      );
      setLoading(false);
    }
  };

  const { campuses, allThatApplies } = formFieldData;

  const otherCheckbox = allThatApplies.find(
    (checkbox) => checkbox.value === 'Other',
  );
  // Preserve each option's original index so submitted field names
  // (`allThatApplies-${index}`) stay unique across the grouped sub-lists.
  const indexedCheckboxes = allThatApplies.map((checkbox, index) => ({
    checkbox,
    index,
  }));
  const nextStepCheckboxes = indexedCheckboxes.filter(({ checkbox }) =>
    NEXT_STEP_VALUES.includes(checkbox.value),
  );
  const generalCheckboxes = indexedCheckboxes.filter(
    ({ checkbox }) =>
      checkbox.value !== 'Other' && !NEXT_STEP_VALUES.includes(checkbox.value),
  );

  return (
    <>
      <h2 className='mb-6 text-3xl text-navy font-bold'>Get Connected</h2>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2'
      >
        {renderInputField(
          'firstName',
          'First Name',
          'text',
          'Please enter your first name',
          undefined,
          'First Name',
        )}
        {renderInputField(
          'lastName',
          'Last Name',
          'text',
          'Please enter your last name',
          undefined,
          'Last Name',
        )}
        {renderInputField(
          'phone',
          'Phone',
          'tel',
          'Please enter a valid number',
          undefined,
          'xxx-xxx-xxxx',
        )}
        {renderInputField(
          'email',
          'Email',
          'text',
          'Please enter a valid email',
          undefined,
          'Example@gmail.com',
        )}

        <Form.Field name='campus' className={radixFormFieldStackClassName}>
          <Form.Label className={radixCompactFormLabelClassName}>
            Campus
          </Form.Label>
          {campuses && (
            <RadixFormSelectShell>
              <Form.Control asChild>
                <select
                  className={radixSelectClassName}
                  required
                  defaultValue=''
                >
                  <option value=''>Select a Campus</option>
                  {campuses.map(({ guid, name }, index) => (
                    <option key={index} value={guid}>
                      {name}
                    </option>
                  ))}
                </select>
              </Form.Control>
            </RadixFormSelectShell>
          )}
          <RadixFormErrorMessage match='valueMissing'>
            Please select a campus
          </RadixFormErrorMessage>
        </Form.Field>

        <Form.Field
          name='decision'
          className={cn(
            'mt-3 flex gap-2 md:items-center',
            formFieldInvalidControlStyles,
          )}
        >
          <Form.Control asChild>
            <input
              type='checkbox'
              id='decision'
              name='decision'
              value='I made a decision to follow Christ today.'
              className={radixCheckboxClassName}
            />
          </Form.Control>
          <Form.Label
            htmlFor='decision'
            className={radixCheckboxOptionLabelClassName}
          >
            I made a decision to follow Christ today
          </Form.Label>
        </Form.Field>

        <h3 className='mt-6 font-bold italic col-span-2 text-lg text-navy md:mt-8 '>
          I am looking to:
        </h3>
        {nextStepCheckboxes.length > 0 && (
          <div className='col-span-2 flex flex-col gap-3 border-b border-gray-200 pb-4'>
            <p className='italic text-navy'>
              Take the next step in my faith through…
            </p>
            <div className='grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-6'>
              {nextStepCheckboxes.map(({ checkbox, index }) =>
                renderCheckboxField(checkbox, index),
              )}
            </div>
          </div>
        )}
        <div className='col-span-2 grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-6'>
          {generalCheckboxes.map(({ checkbox, index }) =>
            renderCheckboxField(checkbox, index),
          )}
        </div>

        {otherCheckbox && (
          <Form.Field
            name='other'
            className={cn(
              'flex gap-2 md:items-center',
              formFieldInvalidControlStyles,
            )}
          >
            <Form.Control asChild>
              <input
                type='checkbox'
                id={otherCheckbox.guid}
                name={otherCheckbox.guid}
                value={otherCheckbox.guid}
                className={radixCheckboxClassName}
                onChange={(_e) => setIsOther(!isOther)}
              />
            </Form.Control>
            <Form.Label
              htmlFor={otherCheckbox.guid}
              className={radixCheckboxOptionLabelClassName}
            >
              {otherCheckbox.value}
            </Form.Label>
          </Form.Field>
        )}

        {isOther && (
          <>
            <div />
            <Form.Field
              name='otherContent'
              className={radixFormFieldStackClassName}
            >
              <Form.Control asChild>
                <input
                  type='text'
                  placeholder='Please specify'
                  className={radixInputClassName}
                />
              </Form.Control>
            </Form.Field>
          </>
        )}

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

export default ConnectCardForm;
