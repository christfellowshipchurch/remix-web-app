import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import Button from "~/primitives/button";
import TextFieldInput from "~/primitives/inputs/text-field";
// import { useAuth } from "providers/AuthProvider"

interface LoginProps {
  onSubmit: (identity: string) => Promise<void>;
}

const NoUserExistsError: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => (
  <div>
    <p className="mt-2 text-xs text-alert">
      Email or phone not found. Would you like to{" "}
      <button onClick={onClick} className="hover:text-red underline">
        create an account?
      </button>
    </p>
  </div>
);

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [identity, setIdentity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { checkUserExists } = useAuth()

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

    let userExists = true;
    // let userExists = false
    // if (isEmail || isPhoneNumber) {
    //   userExists = await checkUserExists(identity)
    // }
    if (!userExists) {
      setLoading(false);
      setError("DOES_NOT_EXIST");
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
    <div className="text-center">
      <h2 className="mb-6 text-5xl font-bold">Log In</h2>
      <Form.Root onSubmit={handleSubmit} className="flex flex-col text-left">
        <Form.Field name="identity" className="flex flex-col">
          <Form.Label>Mobile Number or Email*</Form.Label>
          <Form.Control asChild>
            <TextFieldInput
              identity={identity}
              error={error}
              setIdentity={setIdentity}
              setError={setError}
            />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter a number or email
          </Form.Message>
        </Form.Field>
        {error === "DOES_NOT_EXIST" ? (
          <NoUserExistsError onClick={() => onSubmit("sign-up")} />
        ) : (
          <p className="mt-2 text-xs text-alert">{error}</p>
        )}
        <Form.Submit className="mt-6" asChild>
          <Button size="md" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Log In"}
          </Button>
        </Form.Submit>
      </Form.Root>
      <div className="mt-6 flex justify-center gap-1 text-text_primary">
        <p>{"Don't have an account?"}</p>
        <button
          className="underline  hover:text-black"
          onClick={() => onSubmit("sign-up")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
