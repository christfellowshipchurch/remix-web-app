import * as Form from "@radix-ui/react-form";
import { useEffect, useState } from "react";
import Button from "~/primitives/button";
import { useFetcher } from "react-router";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import RadioButtons from "~/primitives/inputs/radio-buttons";

interface GroupConnectFormProps {
  groupName: string;
  onSuccess: () => void;
}

const GroupConnectForm: React.FC<GroupConnectFormProps> = ({
  groupName,
  onSuccess,
}) => {
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setLoading(false);
      const data = fetcher.data as { error?: string };
      if (data.error) {
        setError(data.error);
      } else {
        onSuccess();
      }
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setBirthDateError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("groupName", groupName);
    formData.append("gender", selectedGender);

    // Validate birth date
    const birthDate = new Date(formData.get("birthDate") as string);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 13) {
      setBirthDateError(
        "You must be at least 13 years old to create an account."
      );
      setLoading(false);
      return;
    }

    try {
      fetcher.submit(formData, {
        method: "post",
        action: "/group-finder",
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-3xl text-navy font-bold">
        Connect with a Leader
      </h2>
      <p className="mb-10 max-w-xs text-pretty">
        Please fill out the form below let a group leader know you are
        interested.
      </p>
      <Form.Root
        onSubmit={handleSubmit}
        className="flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2"
      >
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
        {/* Birthdate */}
        <Form.Field name="birthDate" className="flex flex-col">
          <Form.Label>Birth Date*</Form.Label>
          <Form.Control asChild>
            <input type="date" required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className="text-alert" match="valueMissing">
            Please enter your birth date
          </Form.Message>
          {birthDateError && <p className="text-alert">{birthDateError}</p>}
        </Form.Field>
        {/* Gender */}
        <Form.Field name="gender" className="flex flex-col">
          <Form.Label>Gender</Form.Label>
          <div className="flex gap-4 pt-3">
            <RadioButtons
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              selectedOption={selectedGender}
              onChange={setSelectedGender}
            />
          </div>
        </Form.Field>

        {error && <p className="text-alert col-span-2 text-center">{error}</p>}

        <Form.Submit className="mt-6 mx-auto col-span-1 md:col-span-2" asChild>
          <Button
            className="w-40 h-12"
            size="md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Form.Submit>
      </Form.Root>
    </>
  );
};

export default GroupConnectForm;
