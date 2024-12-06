import * as Form from "@radix-ui/react-form";
import React, { useEffect, useRef, useState } from "react";
import Button from "~/primitives/button";
import { defaultInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";

interface PinScreenProps {
  onSubmit: (pin: string) => Promise<void>;
  phoneNumber: string;
  onResend: () => Promise<void>;
}

const PinScreen: React.FC<PinScreenProps> = ({
  onSubmit,
  phoneNumber,
  onResend,
}) => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+1 ${match[1]} ${match[2]} ${match[3]}`;
    }
    return phoneNumber;
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClick = () => {
    if (error) {
      setPin(["", "", "", "", "", ""]);
      setError(null);
      inputRefs.current[0]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("Text");
    if (/^\d{6}$/.test(pasteData)) {
      const newPin = pasteData.split("");
      setPin(newPin);
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const fullPin = pin.join("");
    if (fullPin.length !== 6) {
      setError("Please enter a 6-digit verification code");
      setLoading(false);
      return;
    }

    try {
      await onSubmit(fullPin);
    } catch (err) {
      setError("Wrong code, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await onResend();
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center text-text_primary">
      <div className="max-w-[340px]">
        <h2 className="mb-2 text-2xl font-bold">Enter verification code</h2>
        <p className="mb-6 text-gray-600">{`We've sent an SMS with an verification code to your phone ${formatPhoneNumber(
          phoneNumber
        )}`}</p>
      </div>
      <Form.Root onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex justify-between gap-2">
          {pin.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onClick={handleClick}
              onPaste={handlePaste}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={`${defaultInputStyles} w-15 h-16 rounded-xl text-center ${
                error ? "border-[#f76052]" : ""
              }`}
            />
          ))}
        </div>
        {error ? (
          <p className="text-center text-sm text-[#EB4335]">{error}</p>
        ) : (
          <div className="mb-4 text-center">
            <span className="text-gray-600">{"I didn't receive a code?"}</span>
            <button
              type="button"
              onClick={handleResend}
              className="pl-1 font-semibold hover:text-ocean"
            >
              Resend
            </button>
          </div>
        )}
        <Form.Submit asChild>
          <Button size="lg" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default PinScreen;
