import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import Button from "~/primitives/button";
import Icon from "~/primitives/icon";
import { defaultInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";

interface CreatePasswordProps {
  onSubmit: (password: string) => void;
}

const CreatePassword: React.FC<CreatePasswordProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    // You might want to add more password strength validation here
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      onSubmit(password);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="mb-6 text-5xl font-bold">Sign Up</h2>
      <p className="mb-6 text-lg text-text_primary">
        Choose a strong password for your account.
      </p>
      <Form.Root
        onSubmit={handleSubmit}
        className="flex flex-col p-4 text-left"
      >
        <Form.Field name="password" className="flex flex-col">
          <Form.Label className="text-text_primary">Password*</Form.Label>
          <div className="relative">
            <Form.Control asChild>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={defaultInputStyles}
              />
            </Form.Control>
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500"
            >
              <Icon name={showPassword ? "eye" : "eyeSlash"} size={24} />
            </span>
          </div>
          <Form.Message className="text-alert" match="valueMissing">
            Please enter a password
          </Form.Message>
          <Form.Message className="text-alert" match="tooShort">
            Password must be at least 8 characters long
          </Form.Message>
        </Form.Field>
        <Form.Field name="confirmPassword" className="mt-4 flex flex-col">
          <Form.Label className="text-text_primary">
            Confirm Password*
          </Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={defaultInputStyles}
            />
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please confirm your password
          </Form.Message>
        </Form.Field>
        {error && <p className="mt-2 text-sm text-alert">{error}</p>}

        <Form.Submit className="mt-8" asChild>
          <Button size="md" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Password"}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default CreatePassword;
