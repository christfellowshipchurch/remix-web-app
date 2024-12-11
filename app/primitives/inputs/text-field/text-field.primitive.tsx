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
}

const TextFieldInput = forwardRef<HTMLInputElement, TextFieldInputProps>(
  ({ className, value, error, setValue, setError }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (error === null && inputRef.current) {
        inputRef.current.focus();
      }
    }, [error]);

    return error ? (
      <div className="relative">
        <input
          ref={ref}
          className="w-full rounded-md border-2 border-alert p-2"
          type="text"
          value={value}
          onFocus={() => setError(null)}
          readOnly
        />
        <span className="absolute right-3 top-2.5 text-gray-500">
          <Icon name="errorCircle" color={colors.alert} />
        </span>
      </div>
    ) : (
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
        className={`${defaultTextInputStyles} ${className}`}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }
);

TextFieldInput.displayName = "TextFieldInput";

export default TextFieldInput;
