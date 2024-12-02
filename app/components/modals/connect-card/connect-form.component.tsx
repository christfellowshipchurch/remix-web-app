import * as Form from "@radix-ui/react-form";
import { useEffect, useState } from "react";
import chevronDownIcon from "../../../assets/icons/chevron-down.svg";
import Button from "~/primitives/button";
import { defaultInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import { useFetcher } from "@remix-run/react";
import { ConnectCardLoaderReturnType } from "~/routes/connect-card/types";

interface ConnectCardProps {
  formFieldData: ConnectCardLoaderReturnType;
  onSuccess: () => void;
}

export const renderInputField = (
  name: string,
  label: string,
  type: string,
  requiredMessage: string
) => (
  <Form.Field name={name} className="flex flex-col mb-4">
    <Form.Label className="font-bold text-sm mb-2">{label}</Form.Label>
    <Form.Control asChild>
      <input type={type} required className={defaultInputStyles} />
    </Form.Control>
    <Form.Message className="text-sm text-alert" match="valueMissing">
      {requiredMessage}
    </Form.Message>
  </Form.Field>
);

export const renderCheckboxField = (checkbox: any, index: number) => (
  <Form.Field
    key={index}
    name={`allThatApplies-${index}`}
    className="flex gap-2 md:items-center"
  >
    <Form.Control asChild>
      <input type="checkbox" id={checkbox.guid} value={checkbox.guid} />
    </Form.Control>
    <Form.Label className="font-bold leading-4">{checkbox.value}</Form.Label>
  </Form.Field>
);

const ConnectCardForm: React.FC<ConnectCardProps> = ({
  formFieldData,
  onSuccess,
}) => {
  const [isOther, setIsOther] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      fetcher.submit(formData, {
        method: "post",
        action: "/connect-card",
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const { campuses, allThatApplies } = formFieldData;

  const otherCheckbox = allThatApplies.find(
    (checkbox) => checkbox.value === "Other"
  );
  const checkboxes = allThatApplies.filter(
    (checkbox) => checkbox.value !== "Other"
  );

  return (
    <>
      <h2 className="mb-6 text-3xl text-secondary font-bold">Get Connected</h2>
      <Form.Root
        onSubmit={handleSubmit}
        className="flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2"
      >
        {renderInputField(
          "firstName",
          "First Name",
          "text",
          "Please enter your first name"
        )}
        {renderInputField(
          "lastName",
          "Last Name",
          "text",
          "Please enter your last name"
        )}
        {renderInputField(
          "phone",
          "Phone",
          "number",
          "Please enter a valid number"
        )}
        {renderInputField(
          "email",
          "Email",
          "text",
          "Please enter a valid email"
        )}

        <Form.Field name="campus" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">Campus</Form.Label>
          <Form.Control asChild>
            {campuses && (
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
                {campuses.map(({ guid, name }, index) => (
                  <option key={index} value={guid}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please select a campus
          </Form.Message>
        </Form.Field>

        <Form.Field name="decision" className="flex gap-2 md:items-center mt-3">
          <Form.Control asChild>
            <input
              className="mb-1"
              type="checkbox"
              id="decision"
              name="decision"
              value="I made a decision to follow Christ today."
            />
          </Form.Control>
          <Form.Label className="font-bold text-secondary leading-4">
            I made a decision to follow Christ today
          </Form.Label>
        </Form.Field>

        <h3 className="mt-6 font-bold italic col-span-2 text-lg text-secondary md:mt-8 ">
          I am looking to:
        </h3>
        {checkboxes.map(renderCheckboxField)}

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

export default ConnectCardForm;
