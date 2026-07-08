import { useEffect, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { useFetcher } from 'react-router-dom';
import { Button } from '~/primitives/button/button.primitive';
import { cn } from '~/lib/utils';
import { pushFormEvent } from '~/lib/gtm';
import { formRadioGroupVerticalStyles } from '~/primitives/inputs/form-control.styles';
import {
  RadixFormErrorMessage,
  RadixFormSelectShell,
  radixCompactFormLabelClassName,
  radixFormFieldStackClassName,
  radixFormLabelClassName,
  radixInputClassName,
  radixRadioClassName,
  radixSelectClassName,
  radixTextareaClassName,
} from '~/primitives/inputs/form-radix-field';
import type { BaptismSignUpLoaderReturnType } from '~/routes/baptism-sign-up/types';

interface BaptismSignUpFormProps {
  onSuccess: () => void;
}

const MAX_STORY_LENGTH = 200;

// Permissive US phone format (e.g. 561-123-4567, (561) 123-4567, 5611234567).
const US_PHONE_PATTERN = '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}';

// See plan decisions #3/#4 — hardcoded until confirmed against Rock admin.
const T_SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const GRADE_OPTIONS = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const SHARE_STORY_OPTIONS = ['Yes', 'No', 'No Preference'];

const US_STATES: { abbr: string; name: string }[] = [
  { abbr: 'AL', name: 'Alabama' },
  { abbr: 'AK', name: 'Alaska' },
  { abbr: 'AZ', name: 'Arizona' },
  { abbr: 'AR', name: 'Arkansas' },
  { abbr: 'CA', name: 'California' },
  { abbr: 'CO', name: 'Colorado' },
  { abbr: 'CT', name: 'Connecticut' },
  { abbr: 'DE', name: 'Delaware' },
  { abbr: 'DC', name: 'District of Columbia' },
  { abbr: 'FL', name: 'Florida' },
  { abbr: 'GA', name: 'Georgia' },
  { abbr: 'HI', name: 'Hawaii' },
  { abbr: 'ID', name: 'Idaho' },
  { abbr: 'IL', name: 'Illinois' },
  { abbr: 'IN', name: 'Indiana' },
  { abbr: 'IA', name: 'Iowa' },
  { abbr: 'KS', name: 'Kansas' },
  { abbr: 'KY', name: 'Kentucky' },
  { abbr: 'LA', name: 'Louisiana' },
  { abbr: 'ME', name: 'Maine' },
  { abbr: 'MD', name: 'Maryland' },
  { abbr: 'MA', name: 'Massachusetts' },
  { abbr: 'MI', name: 'Michigan' },
  { abbr: 'MN', name: 'Minnesota' },
  { abbr: 'MS', name: 'Mississippi' },
  { abbr: 'MO', name: 'Missouri' },
  { abbr: 'MT', name: 'Montana' },
  { abbr: 'NE', name: 'Nebraska' },
  { abbr: 'NV', name: 'Nevada' },
  { abbr: 'NH', name: 'New Hampshire' },
  { abbr: 'NJ', name: 'New Jersey' },
  { abbr: 'NM', name: 'New Mexico' },
  { abbr: 'NY', name: 'New York' },
  { abbr: 'NC', name: 'North Carolina' },
  { abbr: 'ND', name: 'North Dakota' },
  { abbr: 'OH', name: 'Ohio' },
  { abbr: 'OK', name: 'Oklahoma' },
  { abbr: 'OR', name: 'Oregon' },
  { abbr: 'PA', name: 'Pennsylvania' },
  { abbr: 'RI', name: 'Rhode Island' },
  { abbr: 'SC', name: 'South Carolina' },
  { abbr: 'SD', name: 'South Dakota' },
  { abbr: 'TN', name: 'Tennessee' },
  { abbr: 'TX', name: 'Texas' },
  { abbr: 'UT', name: 'Utah' },
  { abbr: 'VT', name: 'Vermont' },
  { abbr: 'VA', name: 'Virginia' },
  { abbr: 'WA', name: 'Washington' },
  { abbr: 'WV', name: 'West Virginia' },
  { abbr: 'WI', name: 'Wisconsin' },
  { abbr: 'WY', name: 'Wyoming' },
];

// Full years between the entered birthdate and today. Returns null for empty,
// invalid, or future dates so callers can withhold the age-based fields.
const computeAge = (birthdate: string): number | null => {
  if (!birthdate) return null;
  const [year, month, day] = birthdate.split('-').map(Number);
  if (!year || !month || !day) return null;

  const dob = new Date(year, month - 1, day);
  if (
    dob.getFullYear() !== year ||
    dob.getMonth() !== month - 1 ||
    dob.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  if (dob > today) return null;

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

const renderTextField = (
  name: string,
  label: string,
  requiredMessage: string,
  options: {
    type?: string;
    required?: boolean;
    placeholder?: string;
    pattern?: string;
    patternMessage?: string;
  } = {},
) => {
  const {
    type = 'text',
    required = true,
    placeholder,
    pattern,
    patternMessage,
  } = options;

  return (
    <Form.Field
      name={name}
      className={cn('mb-4', radixFormFieldStackClassName)}
    >
      <Form.Label className={radixCompactFormLabelClassName}>
        {label}
      </Form.Label>
      <Form.Control asChild>
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          pattern={pattern}
          className={radixInputClassName}
        />
      </Form.Control>
      {required && (
        <RadixFormErrorMessage match='valueMissing'>
          {requiredMessage}
        </RadixFormErrorMessage>
      )}
      {type === 'email' && (
        <RadixFormErrorMessage match='typeMismatch'>
          Please enter a valid email address
        </RadixFormErrorMessage>
      )}
      {pattern && patternMessage && (
        <RadixFormErrorMessage match='patternMismatch'>
          {patternMessage}
        </RadixFormErrorMessage>
      )}
    </Form.Field>
  );
};

const renderSelectField = (
  name: string,
  label: string,
  placeholder: string,
  requiredMessage: string,
  optionElements: React.ReactNode,
) => (
  <Form.Field name={name} className={radixFormFieldStackClassName}>
    <Form.Label className={radixCompactFormLabelClassName}>{label}</Form.Label>
    <RadixFormSelectShell>
      <Form.Control asChild>
        <select required defaultValue='' className={radixSelectClassName}>
          <option value='' disabled>
            {placeholder}
          </option>
          {optionElements}
        </select>
      </Form.Control>
    </RadixFormSelectShell>
    <RadixFormErrorMessage match='valueMissing'>
      {requiredMessage}
    </RadixFormErrorMessage>
  </Form.Field>
);

const BAPTISM_SIGN_UP_INTRO =
  'Fill out the form below to sign up for baptism and someone from our team will follow up with next steps!';

const BaptismSignUpForm: React.FC<BaptismSignUpFormProps> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [inHighSchool, setInHighSchool] = useState('');
  const [story, setStory] = useState('');
  const [formFieldData, setFormFieldData] =
    useState<BaptismSignUpLoaderReturnType>({ campuses: [] });

  const fetcher = useFetcher({ key: 'baptism-sign-up-form' });

  useEffect(() => {
    fetcher.load('/baptism-sign-up');
  }, []);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setLoading(false);

      if ('campuses' in fetcher.data) {
        // Initial data load.
        setFormFieldData(fetcher.data as BaptismSignUpLoaderReturnType);
      } else if ('error' in fetcher.data) {
        setError(fetcher.data.error || 'An unexpected error occurred');
      } else {
        // Successful form submission.
        setError(null);
        pushFormEvent('form_complete', 'baptism_sign_up', 'Baptism Sign Up');
        onSuccess();
      }
    }

    if (fetcher.state === 'submitting') {
      setLoading(true);
      setError(null);
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const handleBirthdateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setBirthdate(value);
    // Reset the High School answer whenever the age is no longer exactly 18 so
    // a stale "Yes" can't keep the guardian block open.
    if (computeAge(value) !== 18) {
      setInHighSchool('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      fetcher.submit(formData, {
        method: 'post',
        action: '/baptism-sign-up',
      });
    } catch {
      setError(
        'An error occurred while submitting the form. Please try again.',
      );
      setLoading(false);
    }
  };

  const { campuses } = formFieldData;
  const age = computeAge(birthdate);
  const showHighSchoolQuestion = age === 18;
  const showGuardianBlock =
    age !== null && (age < 18 || (age === 18 && inHighSchool === 'True'));
  const today = new Date().toISOString().split('T')[0];
  const remaining = MAX_STORY_LENGTH - story.length;

  return (
    <>
      <h2 className='mb-6 text-3xl text-navy font-bold'>Sign Up for Baptism</h2>
      <p className='text-center md:text-left mb-10 col-span-2 text-sm text-text-secondary'>
        {BAPTISM_SIGN_UP_INTRO}
      </p>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2'
      >
        {renderTextField('firstName', 'First Name', 'Please enter your first name', {
          placeholder: 'First Name',
        })}
        {renderTextField('lastName', 'Last Name', 'Please enter your last name', {
          placeholder: 'Last Name',
        })}
        {renderTextField('email', 'Email Address', 'Please enter your email', {
          type: 'email',
          placeholder: 'Example@gmail.com',
        })}
        {renderTextField('phone', 'Cell Phone', 'Please enter your phone number', {
          type: 'tel',
          placeholder: 'xxx-xxx-xxxx',
          pattern: US_PHONE_PATTERN,
          patternMessage: 'Please enter a valid phone number',
        })}

        <Form.Field name='campus' className={radixFormFieldStackClassName}>
          <Form.Label className={radixCompactFormLabelClassName}>
            Home Campus
          </Form.Label>
          <RadixFormSelectShell>
            <Form.Control asChild>
              <select required defaultValue='' className={radixSelectClassName}>
                <option value='' disabled>
                  Select a Campus
                </option>
                {campuses.map(({ guid, name }) => (
                  <option key={guid} value={guid}>
                    {name}
                  </option>
                ))}
              </select>
            </Form.Control>
          </RadixFormSelectShell>
          <RadixFormErrorMessage match='valueMissing'>
            Please select a campus
          </RadixFormErrorMessage>
        </Form.Field>

        <Form.Field name='birthdate' className={radixFormFieldStackClassName}>
          <Form.Label className={radixCompactFormLabelClassName}>
            Birthdate
          </Form.Label>
          <Form.Control asChild>
            <input
              type='date'
              required
              max={today}
              value={birthdate}
              onChange={handleBirthdateChange}
              className={radixInputClassName}
            />
          </Form.Control>
          <RadixFormErrorMessage match='valueMissing'>
            Please enter your birthdate
          </RadixFormErrorMessage>
        </Form.Field>

        <h3 className='col-span-2 mt-4 text-lg font-bold italic text-navy'>
          Address
        </h3>
        {renderTextField('addressLine1', 'Address Line 1', 'Please enter your address', {
          placeholder: 'Street address',
          type: 'text',
        })}
        {renderTextField('addressLine2', 'Address Line 2', '', {
          required: false,
          placeholder: 'Apartment, suite, etc. (optional)',
        })}
        {renderTextField('city', 'City', 'Please enter your city', {
          placeholder: 'City',
        })}
        {renderSelectField(
          'state',
          'State',
          'Select a State',
          'Please select a state',
          US_STATES.map(({ abbr, name }) => (
            <option key={abbr} value={abbr}>
              {name}
            </option>
          )),
        )}
        {renderTextField('zip', 'Zip Code', 'Please enter your zip code', {
          placeholder: 'Zip Code',
        })}

        {renderSelectField(
          'tShirtSize',
          'T-Shirt Size',
          'Select a Size',
          'Please select a t-shirt size',
          T_SHIRT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          )),
        )}

        <Form.Field
          name='myStory'
          className={cn('col-span-1 md:col-span-2', radixFormFieldStackClassName)}
        >
          <Form.Label className={radixFormLabelClassName}>
            Tell us why now is your time to get baptized!
          </Form.Label>
          <Form.Control asChild>
            <textarea
              rows={4}
              required
              maxLength={MAX_STORY_LENGTH}
              value={story}
              onChange={(event) => setStory(event.target.value)}
              className={radixTextareaClassName}
            />
          </Form.Control>
          <p className='text-sm text-text-secondary'>
            {remaining} characters remaining
          </p>
          <RadixFormErrorMessage match='valueMissing'>
            Please tell us why now is your time
          </RadixFormErrorMessage>
        </Form.Field>

        <Form.Field
          name='shareYourStory'
          className={cn(
            'col-span-1 mt-2 md:col-span-2',
            radixFormFieldStackClassName,
          )}
        >
          <Form.Label className={radixFormLabelClassName}>
            Are you comfortable with sharing your story on platform before being
            baptized?
          </Form.Label>
          <div className={formRadioGroupVerticalStyles} role='radiogroup'>
            {SHARE_STORY_OPTIONS.map((option) => (
              <label key={option} className='flex items-center gap-2'>
                <Form.Control asChild>
                  <input
                    type='radio'
                    name='shareYourStory'
                    value={option}
                    required
                    className={radixRadioClassName}
                  />
                </Form.Control>
                <span className='leading-4'>{option}</span>
              </label>
            ))}
          </div>
          <RadixFormErrorMessage match='valueMissing'>
            Please select an option
          </RadixFormErrorMessage>
        </Form.Field>

        {showHighSchoolQuestion && (
          <Form.Field
            name='areYouInHighSchool'
            className={cn(
              'col-span-1 mt-2 md:col-span-2',
              radixFormFieldStackClassName,
            )}
          >
            <Form.Label className={radixFormLabelClassName}>
              Are you in High School?
            </Form.Label>
            <div className={formRadioGroupVerticalStyles} role='radiogroup'>
              {[
                { label: 'Yes', value: 'True' },
                { label: 'No', value: 'False' },
              ].map((option) => (
                <label key={option.value} className='flex items-center gap-2'>
                  <Form.Control asChild>
                    <input
                      type='radio'
                      name='areYouInHighSchool'
                      value={option.value}
                      required
                      checked={inHighSchool === option.value}
                      onChange={(event) => setInHighSchool(event.target.value)}
                      className={radixRadioClassName}
                    />
                  </Form.Control>
                  <span className='leading-4'>{option.label}</span>
                </label>
              ))}
            </div>
            <RadixFormErrorMessage match='valueMissing'>
              Please let us know
            </RadixFormErrorMessage>
          </Form.Field>
        )}

        {showGuardianBlock && (
          <>
            <h3 className='col-span-2 mt-4 text-lg font-bold italic text-navy'>
              Parent / Guardian Information
            </h3>
            {renderSelectField(
              'grade',
              'Grade',
              'Select a Grade',
              'Please select a grade',
              GRADE_OPTIONS.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              )),
            )}
            <div className='hidden md:block' />
            {renderTextField(
              'gFirstName',
              "Guardian's First Name",
              "Please enter the guardian's first name",
              { placeholder: 'First Name' },
            )}
            {renderTextField(
              'gLastName',
              "Guardian's Last Name",
              "Please enter the guardian's last name",
              { placeholder: 'Last Name' },
            )}
            {renderTextField(
              'guardiansEmail',
              "Guardian's Email",
              "Please enter the guardian's email",
              { type: 'email', placeholder: 'Example@gmail.com' },
            )}
            {renderTextField(
              'guardiansPhone',
              "Guardian's Phone Number",
              "Please enter the guardian's phone number",
              {
                type: 'tel',
                placeholder: 'xxx-xxx-xxxx',
                pattern: US_PHONE_PATTERN,
                patternMessage: 'Please enter a valid phone number',
              },
            )}
            {renderTextField(
              'relationship',
              'Relation to the participant',
              'Please enter your relation to the participant',
              { placeholder: 'e.g. Mother, Father, Guardian' },
            )}
          </>
        )}

        {error && <p className='text-alert col-span-2 text-center'>{error}</p>}

        <Form.Submit className='mt-10 mx-auto col-span-1 md:col-span-2' asChild>
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

export default BaptismSignUpForm;
