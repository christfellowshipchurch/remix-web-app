import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';

import { Button } from '~/primitives/button/button.primitive';
import { defaultTextInputStyles } from '~/primitives/inputs/text-field/text-field.primitive';
import { pushFormEvent } from '~/lib/gtm';
import { CAMPUS } from '~/routes/volunteer-form/types';

interface SignupFormProps {
  groupGuid: string;
  waiverLinkText: string;
  /** Path to POST to — the outreach-opportunity route's own action. */
  actionPath: string;
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  groupGuid,
  waiverLinkText,
  actionPath,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { error?: string; success?: boolean };
      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        pushFormEvent(
          'form_complete',
          'community_serving_signup',
          'Community Serving Opportunity Sign Up',
        );
        onSuccess();
      }
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: 'post', action: actionPath });
  };

  return (
    <Form.Root
      onSubmit={handleSubmit}
      className="flex flex-col text-left gap-y-4 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-4"
    >
      <input type="hidden" name="groupGuid" value={groupGuid} />

      <Form.Field name="firstName" className="flex flex-col">
        <Form.Label className="font-bold text-sm mb-1">First Name*</Form.Label>
        <Form.Control asChild>
          <input type="text" required className={defaultTextInputStyles} />
        </Form.Control>
        <Form.Message className="text-alert text-sm" match="valueMissing">
          Please enter your first name
        </Form.Message>
      </Form.Field>

      <Form.Field name="lastName" className="flex flex-col">
        <Form.Label className="font-bold text-sm mb-1">Last Name*</Form.Label>
        <Form.Control asChild>
          <input type="text" required className={defaultTextInputStyles} />
        </Form.Control>
        <Form.Message className="text-alert text-sm" match="valueMissing">
          Please enter your last name
        </Form.Message>
      </Form.Field>

      <Form.Field name="phoneNumber" className="flex flex-col">
        <Form.Label className="font-bold text-sm mb-1">Cell Phone*</Form.Label>
        <Form.Control asChild>
          <input type="tel" required className={defaultTextInputStyles} />
        </Form.Control>
        <Form.Message className="text-alert text-sm" match="valueMissing">
          Please enter your phone number
        </Form.Message>
      </Form.Field>

      <Form.Field name="email" className="flex flex-col">
        <Form.Label className="font-bold text-sm mb-1">Email*</Form.Label>
        <Form.Control asChild>
          <input type="email" required className={defaultTextInputStyles} />
        </Form.Control>
        <Form.Message className="text-alert text-sm" match="valueMissing">
          Please enter your email
        </Form.Message>
        <Form.Message className="text-alert text-sm" match="typeMismatch">
          Please enter a valid email
        </Form.Message>
      </Form.Field>

      <Form.Field name="birthdate" className="flex flex-col">
        <Form.Label className="font-bold text-sm mb-1">Birthdate*</Form.Label>
        <Form.Control asChild>
          <input
            type="date"
            required
            max={new Date().toISOString().slice(0, 10)}
            className={defaultTextInputStyles}
          />
        </Form.Control>
        <Form.Message className="text-alert text-sm" match="valueMissing">
          Please enter your birthdate
        </Form.Message>
      </Form.Field>

      <Form.Field name="campus" className="flex flex-col">
        <Form.Label className="font-bold text-sm mb-1">Home Campus*</Form.Label>
        <Form.Control asChild>
          <select required className={`appearance-none ${defaultTextInputStyles}`} defaultValue="">
            <option value="" disabled>
              Select campus
            </option>
            {CAMPUS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Form.Control>
        <Form.Message className="text-alert text-sm" match="valueMissing">
          Please select your home campus
        </Form.Message>
      </Form.Field>

      <Form.Field name="waiverAccepted" className="flex flex-col gap-2 md:col-span-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <Form.Control asChild>
            <input
              type="checkbox"
              required
              value="true"
              className="mt-1 h-5 w-5 shrink-0 rounded border border-ocean accent-ocean"
            />
          </Form.Control>
          <span className="text-sm">
            I accept the terms of the Christ Fellowship waiver.*
          </span>
        </label>
        <Form.Message className="text-alert text-sm" match="valueMissing">
          You must accept the waiver to sign up.
        </Form.Message>
        {waiverLinkText ? (
          <div
            className="text-sm text-text-secondary [&_a]:text-ocean [&_a]:underline"
            // Rock-admin-controlled HTML attribute (WaiverLinkText default value).
            dangerouslySetInnerHTML={{ __html: waiverLinkText }}
          />
        ) : null}
      </Form.Field>

      {error ? (
        <p className="text-alert text-sm md:col-span-2 text-center">{error}</p>
      ) : null}

      <Form.Submit className="mt-2 mx-auto md:col-span-2" asChild>
        <Button
          intent="primary"
          className="w-40 h-12 rounded-full"
          size="md"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </Form.Submit>
    </Form.Root>
  );
};

export default SignupForm;
