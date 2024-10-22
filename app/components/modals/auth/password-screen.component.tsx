"use client";
import * as Form from "@radix-ui/react-form";
import React, { useEffect, useState } from "react";
import Button from "~/primitives/button";
import { defaultInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";

interface PasswordScreenProps {
  onSubmit: (password: string) => Promise<void>;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Focus on the password input when the component mounts
    document.getElementById("password")?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(password);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="mb-6 text-5xl font-bold">Log In</h2>
      <Form.Root
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 text-left"
      >
        <Form.Field name="password" className="flex flex-col">
          <Form.Label className="text-gray-700">Password*</Form.Label>
          <div className="relative">
            <Form.Control asChild>
              <input
                id="password"
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
              className="absolute right-3 top-3 text-gray-500"
            >
              <img
                src={`/icons/eye${!showPassword ? "-slash" : ""}.svg`}
                alt="cross circled icon"
                width={20}
                height={20}
              />
            </span>
          </div>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            Please enter a password
          </Form.Message>
        </Form.Field>
        {error && <p className="font-xs text-alert">{error}</p>}
        <Form.Submit className="mt-2" asChild>
          <Button size="md" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Log In"}
          </Button>
        </Form.Submit>
      </Form.Root>
      <div className="flex justify-center gap-1 text-neutral-600">
        {/* TODO: create a password reset page... */}
        <a href="/" className="underline  hover:text-black">
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

export default PasswordScreen;
