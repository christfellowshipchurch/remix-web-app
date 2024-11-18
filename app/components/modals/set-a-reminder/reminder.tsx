import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import chevronDownIcon from "../../../assets/icons/chevron-down.svg";
import Button from "~/primitives/button";
import TextFieldInput from "~/primitives/inputs/text-field";
import { defaultInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";

export const campuses = [
  "Select a Campus",
  "Palm Beach Gardens",
  "Port St. Lucie",
  "Royal Palm Beach",
  "Boynton Beach",
  "Jupiter",
  "Stuart",
  "Okeechobee",
  "Belle Glade",
  "Boca Raton",
  "Vero Beach",
  "Christ Fellowship Español Palm Beach Gardens",
  "Christ Fellowship Español Royal Palm Beach",
  "Online (CF Everywhere)",
  "Westlake",
  "Trinity",
];

interface ReminderProps {
  onSubmit: (connect: string) => Promise<void>;
}

const Reminder: React.FC<ReminderProps> = ({ onSubmit }) => {
  const [campus, setCampus] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  // TODO: OTHER CHECKBOXES?

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    /** We may be able to remove this error checking since RadixUI already handles some of it... */
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneNumber = /^\d{10}$/.test(phoneNumber); // Adjust regex for phone number format as needed
    const isCampus = campus !== "Select a Campus";

    if (!isEmail && !isPhoneNumber) {
      setLoading(false);
      setError("Please enter a valid email or phone number.");
      return;
    }

    if (!isCampus) {
      setLoading(false);
      setError("Please select a Campus");
      return;
    }

    // TODO: SETUP SUBMIT SET A REMINDER LOGIC

    // Will display the confirmation modal if successful
    try {
      await onSubmit("Reminder");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // TODO: SETUP REMINDER FORM
  return (
    <>
      <h2 className="mb-6 text-3xl text-secondary font-bold">Get Connected</h2>
      <Form.Root
        onSubmit={handleSubmit}
        className="grid text-left grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* First Name */}
        <Form.Field name="identity" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">First Name</Form.Label>
          <Form.Control asChild>
            <TextFieldInput
              value={firstName}
              error={error}
              setValue={setFirstName}
              setError={setError}
            />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter your first name
          </Form.Message>
        </Form.Field>

        {/* Last Name */}
        <Form.Field name="identity" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">Last Name</Form.Label>
          <Form.Control asChild>
            <TextFieldInput
              value={lastName}
              error={error}
              setValue={setLastName}
              setError={setError}
            />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter your last name
          </Form.Message>
        </Form.Field>

        {/* Phone Number */}
        <Form.Field name="identity" className="flex flex-col">
          <Form.Label className="font-bold text-sm pb-1">Phone</Form.Label>
          <Form.Control asChild>
            <TextFieldInput
              value={phoneNumber}
              error={error}
              setValue={setPhoneNumber}
              setError={setError}
            />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter a valid number
          </Form.Message>
        </Form.Field>

        {/* Email */}
        <Form.Field name="identity" className="flex flex-col">
          <Form.Label className="font-bold text-sm pb-1">Email</Form.Label>
          <Form.Control asChild>
            <TextFieldInput
              value={email}
              error={error}
              setValue={setEmail}
              setError={setError}
            />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter a valid email
          </Form.Message>
        </Form.Field>

        {/* Campus */}
        <Form.Field name="identity" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">Campus</Form.Label>
          <Form.Control asChild>
            <select
              className={`appearance-none ${defaultInputStyles}`}
              onChange={(e) => setCampus(e.target.value)}
              required
              style={{
                backgroundImage: `url(${chevronDownIcon})`,
                backgroundSize: "24px",
                backgroundPosition: "calc(100% - 2%) center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {campuses.map((campus, index) => (
                <option key={index} value={campus}>
                  {campus}
                </option>
              ))}
            </select>
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please select a campus
          </Form.Message>
        </Form.Field>

        {/* Decision Checkbox */}
        <Form.Field name="identity" className="flex gap-2 md:items-center">
          <Form.Control asChild>
            <input
              className="mb-1"
              type="checkbox"
              id="decision"
              name="decision"
              value="decision"
            />
          </Form.Control>
          <Form.Label className="font-bold text-secondary leading-4">
            I made a decision to follow Christ today
          </Form.Label>
        </Form.Field>

        {/* Submit Button */}
        <Form.Submit className="mt-2 mx-auto col-span-1 md:col-span-2" asChild>
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

export default Reminder;
