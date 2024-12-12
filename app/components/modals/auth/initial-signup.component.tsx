import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import TextFieldInput from "~/primitives/inputs/text-field/text-field.primitive";
import Button from "~/primitives/button";
import { useAuth } from "~/providers/auth-provider";

interface InitialSignUpProps {
  onSubmit: (identity: string) => Promise<void>;
}

const UserExistsError: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => (
  <div>
    <p className="text-sm text-alert">
      This account already exists. Would you like to{" "}
      <button onClick={onClick} className="hover:text-red underline">
        Log in?
      </button>
    </p>
  </div>
);

const InitialSignUp: React.FC<InitialSignUpProps> = ({ onSubmit }) => {
  const [identity, setIdentity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkUserExists } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    /** We may be able to remove this error checking since RadixUI already handles some of it... */
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity);
    const isPhoneNumber = /^\d{10}$/.test(identity); // Adjust regex for phone number format as needed

    if (!isEmail && !isPhoneNumber) {
      setLoading(false);
      setError("Please enter a valid email or phone number.");
      return;
    }

    const userExists = await checkUserExists(identity);

    if (userExists) {
      setLoading(false);
      setError("ALREADY_EXISTS");
      return;
    }

    try {
      await onSubmit(identity);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center text-text_primary">
      <h2 className="mb-6 text-5xl font-bold">Sign Up</h2>
      <p className="mb-8 text-lg">
        Enter your phone number <br /> or email address to get started.
      </p>
      <Form.Root onSubmit={handleSubmit} className="flex flex-col text-left">
        <Form.Field name="identity" className="flex flex-col">
          <Form.Label>Mobile Number or Email*</Form.Label>
          <Form.Control asChild>
            <TextFieldInput
              value={identity}
              error={error}
              setValue={setIdentity}
              setError={setError}
            />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter a number or email
          </Form.Message>
        </Form.Field>
        {error === "ALREADY_EXISTS" ? (
          <UserExistsError onClick={() => onSubmit("")} />
        ) : (
          <p className="text-sm text-alert">{error}</p>
        )}
        <Form.Field className="mt-4" name="agreement">
          <div className="flex items-center gap-3">
            <Form.Control asChild>
              <input id="c1" type="checkbox" className="text-ocean" required />
            </Form.Control>
            <label className="text-xs" htmlFor="c1">
              I agree to the Terms of Use and Privacy Policy laid out by Christ
              Fellowship Church.
            </label>
          </div>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please agree to the terms and conditions
          </Form.Message>
        </Form.Field>
        <Form.Submit className="mt-12" asChild>
          <Button size="md" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Agree & Continue"}
          </Button>
        </Form.Submit>
      </Form.Root>
      <div className="mt-4 flex justify-center gap-1">
        <p>Already have an account?</p>
        <button
          className="underline  hover:text-black"
          onClick={() => onSubmit("")}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default InitialSignUp;
