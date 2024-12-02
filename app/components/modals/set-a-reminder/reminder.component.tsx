import * as Form from "@radix-ui/react-form";
import { useEffect, useState } from "react";
import chevronDownIcon from "../../../assets/icons/chevron-down.svg";
import Button from "~/primitives/button";
import { defaultInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import { useFetcher } from "@remix-run/react";
import { dayTimes } from "~/routes/locations/locationSingle/loader";
import { renderInputField } from "../connect-card/connect-form.component";

interface ReminderProps {
  serviceTimes: dayTimes[];
  onSuccess: () => void;
  campus: string;
}

const ReminderForm: React.FC<ReminderProps> = ({
  campus,
  onSuccess,
  serviceTimes,
}) => {
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
        action: "/set-a-reminder",
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  console.log(serviceTimes);
  return (
    <>
      <h2 className="mb-6 text-3xl text-secondary font-bold">
        Set A Reminder!
      </h2>
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
            <select
              className={`appearance-none ${defaultInputStyles}`}
              disabled
              required
              style={{
                backgroundImage: `url(${chevronDownIcon})`,
                backgroundSize: "24px",
                backgroundPosition: "calc(100% - 2%) center",
                backgroundRepeat: "no-repeat",
              }}
              defaultValue={campus}
            >
              <option value={campus}>{campus}</option>
            </select>
          </Form.Control>
        </Form.Field>

        <Form.Field name="campus" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">
            Service Time
          </Form.Label>
          <Form.Control asChild>
            {serviceTimes && (
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
                <option value={""}>Select a Service Time</option>
                {serviceTimes.map(({ hour }) =>
                  // TODO: Add guid? -> Might need to update the type
                  hour.map((time: string, index: number) => (
                    <option key={index}>{time}</option>
                  ))
                )}
              </select>
            )}
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please select a service time
          </Form.Message>
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

export default ReminderForm;
