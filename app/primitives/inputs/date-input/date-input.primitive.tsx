import React, { forwardRef, useEffect, useRef } from "react";
import Icon from "~/primitives/icon";
import colors from "~/styles/colors";

export const defaultDateInputStyles =
  "rounded-md border border-neutral-500 p-2 focus:border-2 focus:border-ocean focus:outline-none focus:ring-0 data-[invalid=true]:focus:border-alert w-full";

interface DateInputProps {
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  label?: string;
  isRequired?: boolean;
  min?: string;
  max?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      className = "",
      value,
      error,
      setValue,
      setError,
      label,
      isRequired = false,
      min,
      max,
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
          <label className="font-bold text-text-primary text-sm mb-1">
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
              className="w-full rounded-md border-2 border-alert p-2"
              type="date"
              value={value}
              onFocus={() => setError(null)}
              readOnly
              required={isRequired}
              min={min}
              max={max}
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
            className={`${defaultDateInputStyles} ${className}`}
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={isRequired}
            min={min}
            max={max}
          />
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
