import * as Form from "@radix-ui/react-form";
import { useEffect, useState } from "react";
import chevronDownIcon from "../../../assets/icons/chevron-down.svg";
import Button from "~/primitives/button";
import { defaultInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";

interface ConnectCardProps {
  campuses: string[];
  checkboxes: { guid: string; value: string }[];
  onSuccess: () => void;
}

const ConnectCardForm: React.FC<ConnectCardProps> = ({
  campuses = [],
  checkboxes = [],
  onSuccess,
}) => {
  const [isOther, setIsOther] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** todo : figure out how to pull in the loader data... */
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("/connect-card");
  //     const result = await response.json();
  //     setData(result);

  //     console.log(data);
  //   };

  //   fetchData();
  // }, []);

  // Note: Separate the "Other" checkbox from the rest of the checkboxes so we can add our custom logic
  let otherCheckbox = null;
  if (checkboxes.length > 0) {
    otherCheckbox = checkboxes.find((checkbox) => checkbox.value === "Other");
    checkboxes = checkboxes.filter((checkbox) => checkbox.value !== "Other");
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );
    const allThatAppliesValues = Object.keys(formData)
      .filter((key) => key.includes("allThatApplies"))
      .map((key) => formData[key])
      .join(", ");

    const { email, firstName, lastName, phoneNumber, other, campus } = formData;

    /** We may be able to remove this error checking since RadixUI already handles some of it... */
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string);
    const isPhoneNumber = /^\d{10}$/.test(phoneNumber as string); // Adjust regex for phone number format as needed

    if (!isEmail && !isPhoneNumber) {
      setLoading(false);
      setError("Please enter a valid email or phone number.");
      return;
    }

    try {
      const response = await fetch("/connect-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          campus,
          allThatAppliesValues,
          other,
        }),
      });

      if (!response.ok) {
        throw new Error("An error occurred while submitting your request.");
      }

      return onSuccess();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-3xl text-secondary font-bold">Get Connected</h2>
      <Form.Root
        onSubmit={handleSubmit}
        className="grid text-left grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* First Name */}
        <Form.Field name="firstName" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">First Name</Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultInputStyles} />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter your first name
          </Form.Message>
        </Form.Field>

        {/* Last Name */}
        <Form.Field name="lastName" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">Last Name</Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultInputStyles} />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter your last name
          </Form.Message>
        </Form.Field>

        {/* Phone Number */}
        <Form.Field name="phone" className="flex flex-col">
          <Form.Label className="font-bold text-sm pb-1">Phone</Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultInputStyles} />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter a valid number
          </Form.Message>
        </Form.Field>

        {/* Email */}
        <Form.Field name="email" className="flex flex-col">
          <Form.Label className="font-bold text-sm pb-1">Email</Form.Label>
          <Form.Control asChild>
            <input type="text" required className={defaultInputStyles} />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter a valid email
          </Form.Message>
        </Form.Field>

        {/* Campus */}
        <Form.Field name="campus" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">Campus</Form.Label>
          <Form.Control asChild>
            <select
              className={`appearance-none ${defaultInputStyles}`}
              required
              style={{
                backgroundImage: `url(${chevronDownIcon})`,
                backgroundSize: "24px",
                backgroundPosition: "calc(100% - 2%) center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <option value={""}>Select a Campus</option>
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
        <Form.Field name="decision" className="flex gap-2 md:items-center">
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

        <h3 className="mt-6 font-bold italic col-span-2 text-lg text-secondary">
          I am looking to:
        </h3>
        {checkboxes &&
          checkboxes.map((checkbox, index) => (
            <Form.Field
              key={index}
              name={`allThatApplies-${index}`}
              className="flex gap-2 md:items-center"
            >
              <Form.Control asChild>
                <input
                  type="checkbox"
                  id={checkbox.guid}
                  value={checkbox.guid}
                />
              </Form.Control>
              <Form.Label className="font-bold leading-4">
                {checkbox.value}
              </Form.Label>
            </Form.Field>
          ))}
        {/* Other Checkbox */}
        {otherCheckbox && (
          <Form.Field name="other" className="flex gap-2 md:items-center">
            <Form.Control asChild>
              <input
                className="mb-1"
                type="checkbox"
                id={otherCheckbox.guid}
                name={otherCheckbox.guid}
                value={otherCheckbox.guid}
                onChange={(e) => setIsOther(!isOther)}
              />
            </Form.Control>
            <Form.Label className="font-bold leading-4">
              {otherCheckbox.value}
            </Form.Label>
          </Form.Field>
        )}

        {/* Other Text Field */}
        {isOther && (
          <>
            <div />
            <Form.Field name="otherContent" className="flex flex-col">
              <Form.Control asChild>
                <input type="text" className={defaultInputStyles} />
              </Form.Control>
            </Form.Field>
          </>
        )}

        {error && <p className="text-alert col-span-2">{error}</p>}

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

export default ConnectCardForm;
