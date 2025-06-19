import React, { forwardRef, useEffect, useRef, useState } from "react";
import Icon from "~/primitives/icon";
import colors from "~/styles/colors";
import { defaultTextInputStyles } from "./text-field.primitive";

interface SecureTextFieldInputProps {
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
}

const SecureTextFieldInput = forwardRef<
  HTMLInputElement,
  SecureTextFieldInputProps
>(
  (
    {
      className = "",
      value,
      error,
      setValue,
      setError,
      placeholder = "***-**-0000",
      label,
      isRequired = false,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [maskedValue, setMaskedValue] = useState("");

    // Helper function to mask SSN
    const maskSSN = (rawValue: string) => {
      const len = rawValue.length;
      if (len === 0) return "";

      const first = rawValue.slice(0, 3);
      const mid = rawValue.slice(3, 5);
      const last = rawValue.slice(5);

      if (len <= 3) {
        return "*".repeat(len);
      }
      if (len <= 5) {
        return "***-" + "*".repeat(len - 3);
      }
      return "***-**-" + last;
    };

    // Update masked value whenever the real value changes
    useEffect(() => {
      setMaskedValue(maskSSN(value));
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

      // Allow navigation keys
      if (["ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(key)) {
        return;
      }

      // Handle backspace
      if (key === "Backspace") {
        if (value.length > 0) {
          setValue(value.slice(0, -1));
        }
        e.preventDefault();
        return;
      }

      // Ignore non-digit keys
      if (!/\d/.test(key)) {
        e.preventDefault();
        return;
      }

      // Append digit if we have < 9 so far
      if (value.length < 9) {
        setValue(value + key);
      }

      e.preventDefault();
    };

    useEffect(() => {
      if (error === null && inputRef.current) {
        inputRef.current.focus();
      }
    }, [error]);

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="font-bold text-text-primary mb-1">
            {isRequired && <span className="text-ocean mr-1">{"*"}</span>}
            {label}
            {isRequired && (
              <span className="font-normal text-text-secondary ml-1 italic">
                {"(required)"}
              </span>
            )}
          </label>
        )}
        {error ? (
          <div className="relative">
            <input
              ref={ref}
              className="w-full rounded-md border-2 border-alert p-2 pl-10"
              type="text"
              value={maskedValue}
              placeholder={placeholder}
              required={isRequired}
              onFocus={() => setError(null)}
              readOnly
            />
            <span className="absolute right-3 top-2.5 text-gray-500">
              <Icon name="errorCircle" color={colors.alert} />
            </span>
          </div>
        ) : (
          <div className="relative">
            <input
              ref={(el) => {
                (
                  inputRef as React.MutableRefObject<HTMLInputElement | null>
                ).current = el;
                if (typeof ref === "function") {
                  ref(el);
                } else if (ref) {
                  ref.current = el;
                }
              }}
              className={`${defaultTextInputStyles} ${className} pl-10`}
              type="text"
              value={maskedValue}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              required={isRequired}
              inputMode="numeric"
              autoComplete="off"
            />
            <span className="absolute left-3 top-2.5">
              <Icon name="lockAlt" className="text-navy size-5" />
            </span>
          </div>
        )}
      </div>
    );
  }
);

SecureTextFieldInput.displayName = "SecureTextFieldInput";

export default SecureTextFieldInput;
