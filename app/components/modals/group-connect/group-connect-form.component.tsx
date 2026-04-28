import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import { Button } from '~/primitives/button/button.primitive';
import { defaultTextInputStyles } from '~/primitives/inputs/text-field/text-field.primitive';
import SelectInput from '~/primitives/inputs/select-input/select-input.primitive';
import { pushFormEvent } from '~/lib/gtm';
import { RockCampuses } from '~/lib/rock-config';

interface GroupConnectFormProps {
  groupId: string;
  campus?: string;
  onSuccess: () => void;
}

const campusOptions = RockCampuses.map((c) => ({ value: c.name, label: c.name }));

const GroupConnectForm: React.FC<GroupConnectFormProps> = ({
  groupId,
  campus,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(campus ?? '');
  const [campusError, setCampusError] = useState<string | null>(null);

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setLoading(false);
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
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      fetcher.submit(formData, {
        method: 'post',
        action: '/group-finder',
      });
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
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
            <SelectInput
              name="campus"
              label="Campus"
              value={selectedCampus}
              error={campusError}
              setValue={setSelectedCampus}
              setError={setCampusError}
              options={campusOptions}
              placeholder="Select a campus"
            />
          </Form.Field>
        )}

        {error && <p className="text-alert col-span-2 text-center">{error}</p>}

        <Form.Submit className="mt-6 mx-auto col-span-1 md:col-span-2" asChild>
          <Button
            className="w-40 h-12"
            size="md"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </Form.Submit>
      </Form.Root>
    </>
  );
};

export default GroupConnectForm;
