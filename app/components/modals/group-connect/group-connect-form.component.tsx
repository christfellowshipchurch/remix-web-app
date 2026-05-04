import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import { Button } from '~/primitives/button/button.primitive';
import { defaultTextInputStyles } from '~/primitives/inputs/text-field/text-field.primitive';
import { pushFormEvent } from '~/lib/gtm';

interface GroupConnectFormProps {
  groupId: string;
  campus?: string;
  onSuccess: () => void;
}

const GroupConnectForm: React.FC<GroupConnectFormProps> = ({
  groupId,
  campus,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as { error?: string };
      if (data.error) {
        setError(data.error);
      } else {
        pushFormEvent('form_complete', 'group_signup', 'Group/Class Signup');
        onSuccess();
      }
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      fetcher.submit(formData, {
        method: 'post',
        action: '/group-finder',
      });
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <h2 className="mb-6 text-3xl text-navy font-bold">
        Connect with a Leader
      </h2>
      <p className="mb-10 max-w-xs text-pretty mx-auto">
        Please fill out the form below to let a group leader know you are
        interested.
      </p>
      <Form.Root
        onSubmit={handleSubmit}
        className="flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2"
      >
        <input type="hidden" name="groupId" value={groupId} />

        {/* First Name */}
        <Form.Field name="firstName" className="flex flex-col">
          <Form.Label>First Name*</Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className="text-alert" match="valueMissing">
            Please enter your first name
          </Form.Message>
        </Form.Field>
        {/* Last Name */}
        <Form.Field name="lastName" className="flex flex-col">
          <Form.Label>Last Name*</Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className="text-alert" match="valueMissing">
            Please enter your last name
          </Form.Message>
        </Form.Field>
        {/* Phone */}
        <Form.Field name="phoneNumber" className="flex flex-col">
          <Form.Label>Phone*</Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className="text-alert" match="valueMissing">
            Please enter your phone number
          </Form.Message>
        </Form.Field>
        {/* Email */}
        <Form.Field name="email" className="flex flex-col">
          <Form.Label>Email*</Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className="text-alert" match="valueMissing">
            Please enter your email
          </Form.Message>
        </Form.Field>

        {/* Campus (optional — only shown when campus prop is provided) */}
        {campus !== undefined && (
          <Form.Field name="campus" className="flex flex-col md:col-span-2">
            <Form.Label className="font-bold text-sm mb-2">Campus</Form.Label>
            <input type="hidden" name="campus" value={campus} />
            <Form.Control asChild>
              <select
                className={`appearance-none ${defaultTextInputStyles} text-neutral-400`}
                required
                disabled
                style={{
                  backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                  backgroundSize: '24px',
                  backgroundPosition: 'calc(100% - 2%) center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <option>{campus}</option>
              </select>
            </Form.Control>
          </Form.Field>
        )}

        {error && <p className="text-alert col-span-2 text-center">{error}</p>}

        <Form.Submit className="mt-6 mx-auto col-span-1 md:col-span-2" asChild>
          <Button
            className="w-40 h-12"
            size="md"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Submit'}
          </Button>
        </Form.Submit>
      </Form.Root>
    </>
  );
};

export default GroupConnectForm;
