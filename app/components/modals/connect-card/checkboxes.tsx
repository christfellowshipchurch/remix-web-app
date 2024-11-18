import * as Form from "@radix-ui/react-form";
import TextFieldInput from "~/primitives/inputs/text-field";

type ConnectCardCheckboxesTypes = {
  other: boolean;
  setOther: (value: boolean) => void;
  otherContent: string;
  setOtherContent: (value: string) => void;
  error: string | null;
  setError: (value: string | null) => void;
};

const ConnectCardCheckboxes = ({
  other,
  setOther,
  otherContent,
  setOtherContent,
  error,
  setError,
}: ConnectCardCheckboxesTypes) => {
  return (
    <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
      <p className="italic text-sm">I am looking to:</p>
      <div className="flex flex-col gap-2">
        {/* Find meaningful community */}
        <Form.Field name="identity" className="flex gap-2 items-center">
          <Form.Control asChild>
            <input
              className="mb-1"
              type="checkbox"
              id="community"
              name="community"
              value="community"
            />
          </Form.Control>
          <Form.Label className="text-sm leading-4">
            Find meaningful community
          </Form.Label>
        </Form.Field>

        {/* Grow in my faith */}
        <Form.Field name="identity" className="flex gap-2 items-center">
          <Form.Control asChild>
            <input
              className="mb-1"
              type="checkbox"
              id="faith"
              name="faith"
              value="faith"
            />
          </Form.Control>
          <Form.Label className="text-sm leading-4">
            Grow in my faith
          </Form.Label>
        </Form.Field>

        {/* Find a fun place for my kid(s) to grow and make friends. */}
        <Form.Field name="identity" className="flex gap-2 items-center">
          <Form.Control asChild>
            <input
              className="mb-1"
              type="checkbox"
              id="kids"
              name="kids"
              value="kids"
            />
          </Form.Control>
          <Form.Label className="text-sm leading-4">
            Find a fun place for my kid(s) to grow and make friends.
          </Form.Label>
        </Form.Field>

        {/* Make my marriage stronger than it's ever been. */}
        <Form.Field name="identity" className="flex gap-2 items-center">
          <Form.Control asChild>
            <input
              className="mb-1"
              type="checkbox"
              id="marriage"
              name="marriage"
              value="marriage"
            />
          </Form.Control>
          <Form.Label className="text-sm leading-4">
            Make my marriage stronger than it's ever been.
          </Form.Label>
        </Form.Field>

        {/* Improve my finances. */}
        <Form.Field name="identity" className="flex gap-2 items-center">
          <Form.Control asChild>
            <input
              className="mb-1"
              type="checkbox"
              id="finances"
              name="finances"
              value="finances"
            />
          </Form.Control>
          <Form.Label className="text-sm leading-4">
            Improve my finances.
          </Form.Label>
        </Form.Field>

        {/* Other Checkbox */}
        <Form.Field name="identity" className="flex gap-2 items-center">
          <Form.Control asChild>
            <input
              className="mb-1"
              type="checkbox"
              id="other"
              name="other"
              value="Other"
              onChange={(e) => setOther(!other)}
            />
          </Form.Control>
          <Form.Label className="text-sm leading-4">Other</Form.Label>
        </Form.Field>

        {/* Other Content */}
        {other && (
          <Form.Field name="identity" className="flex flex-col md:mt-2 gap-2">
            <Form.Label className="md:ml-2 text-sm italic">
              I am looking to: (Other)
            </Form.Label>
            <Form.Control asChild className="max-w-56">
              <TextFieldInput
                value={otherContent}
                error={error}
                setValue={setOtherContent}
                setError={setError}
              />
            </Form.Control>
          </Form.Field>
        )}
      </div>
    </div>
  );
};

export default ConnectCardCheckboxes;
