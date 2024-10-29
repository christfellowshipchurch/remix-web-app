/**
 * @name TextFieldInput
 * @description This component is a text input field that can be used in forms. It was mainly created inorder to be able to place icons inside the input field when there is an error. If icon is not needed, a normal text input field can be used with the defaultInputStyles.
 */

import React, { forwardRef, useEffect, useRef } from "react";
import errorCircleIcon from "~/assets/icons/error-circle.svg";
import Icon from "~/primitives/icon";

export const defaultInputStyles =
  "rounded-md border border-neutral-500 p-2 focus:border-2 focus:border-primary focus:outline-none focus:ring-0 data-[invalid=true]:focus:border-alert w-full";

interface TextFieldInputProps {
  identity: string;
  error: string | null;
  setIdentity: (value: string) => void;
  setError: (value: string | null) => void;
}

const TextFieldInput = forwardRef<HTMLInputElement, TextFieldInputProps>(
  ({ identity, error, setIdentity, setError }, ref) => {
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
          value={identity}
          onFocus={() => setError(null)}
          readOnly
        />
        <span className="absolute right-3 top-2.5 text-gray-500">
          <Icon name="errorCircle" />
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
        className={defaultInputStyles}
        type="text"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
      />
    );
  }
);

TextFieldInput.displayName = "TextFieldInput";

export default TextFieldInput;
