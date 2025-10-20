import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import { NewUser } from "./login-flow.component";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import RadioButtons from "~/primitives/inputs/radio-buttons";
import { Button } from "~/primitives/button/button.primitive";

interface AccountCreationProps {
  onSubmit: (userData: NewUser) => Promise<void>;
  identityType: "email" | "phone" | "unknown";
}

const AccountCreation: React.FC<AccountCreationProps> = ({
  identityType,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setBirthDateError(null);

    const formData = new FormData(event.currentTarget);
    const additionalField = identityType === "email" ? "phone" : "email"; // we want to add the field that the user has not already entered into the form
    const userData: NewUser = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      birthDate: formData.get("birthDate") as string,
      gender: selectedGender,
      [additionalField]: formData.get(additionalField) as string,
    };

    // Validate birth date
    const birthDate = new Date(userData.birthDate);
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
      await onSubmit(userData);
    } catch {
      setError(
        "An error occurred while creating your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">
        {"Nice, let's get some basic info about you."}
      </h2>
      <p className="mb-6 text-lg text-neutral-600">
        Please provide some basic information to complete your account setup.
      </p>
      <Form.Root
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
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
        {/* Email or Phone */}
        <Form.Field
          name={identityType === "email" ? "phone" : "email"}
          className="flex flex-col"
        >
          <Form.Label>
            {identityType === "email" ? "Phone" : "Email"}
          </Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultTextInputStyles} />
          </Form.Control>
          <Form.Message className="text-alert" match="valueMissing">
            Please enter your email
          </Form.Message>
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
        {error && <p className="text-alert">{error}</p>}
        {/* Submit */}
        <div className="col-span-1 mt-8 md:col-span-2">
          <Form.Submit asChild>
            <Button
              className="w-full"
              size="md"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Continue"}
            </Button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>
  );
};

export default AccountCreation;
