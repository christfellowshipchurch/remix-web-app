/**
 * @name TextFieldInput
 * @description This component is a text input field that can be used in forms. It was mainly created inorder to be able to place icons inside the input field when there is an error. If icon is not needed, a normal text input field can be used with the defaultTextInputStyles.
 */

import React, { forwardRef, useEffect, useRef } from "react";
import Icon from "~/primitives/icon";
import colors from "~/styles/colors";

export const defaultTextInputStyles =
  "rounded-md border border-neutral-500 p-2 focus:border-2 focus:border-ocean focus:outline-none focus:ring-0 data-[invalid=true]:focus:border-alert w-full";

interface TextFieldInputProps {
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  customIcon?: React.ReactNode;
}

const TextFieldInput = forwardRef<HTMLInputElement, TextFieldInputProps>(
  (
    {
      className = "",
      value,
      error,
      setValue,
      setError,
      type = "text",
      placeholder = "",
      label,
      isRequired = false,
      customIcon,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

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
              type={type}
              value={value}
              placeholder={placeholder}
              onFocus={() => setError(null)}
              readOnly
              required={isRequired}
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
              className={`${defaultTextInputStyles} ${className} ${
                type === "email" || type === "tel" || customIcon ? "pl-10" : ""
              }`}
              type={type}
              value={value}
              placeholder={placeholder}
              onChange={(e) => setValue(e.target.value)}
              required={isRequired}
            />
            {type === "email" && (
              <span className="absolute left-3 top-2.5">
                <Icon name="envelope" className="text-navy size-5 mt-[1px]" />
              </span>
            )}
            {type === "tel" && (
              <span className="absolute left-3 top-2.5">
                <Icon name="smartphone" className="text-navy size-5" />
              </span>
            )}
            {customIcon && (
              <span className="absolute left-3 top-2.5">{customIcon}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextFieldInput.displayName = "TextFieldInput";

export default TextFieldInput;
