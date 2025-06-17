import React, { forwardRef } from "react";
import Icon from "~/primitives/icon";
import colors from "~/styles/colors";

export const defaultSelectInputStyles =
  "rounded-md border border-neutral-500 p-2 focus:border-2 focus:border-ocean focus:outline-none focus:ring-0 data-[invalid=true]:focus:border-alert w-full";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  className?: string;
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (value: string | null) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      className = "",
      value,
      error,
      setValue,
      setError,
      options,
      placeholder = "",
      label,
      isRequired = false,
    },
    ref
  ) => {
    return (
      <div className="relative flex flex-col gap-1 w-full">
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
            <select
              ref={ref}
              className="w-full rounded-md border-2 border-alert p-2 bg-white"
              value={value}
              onFocus={() => setError(null)}
              required={isRequired}
              data-invalid={!!error}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-2.5 text-gray-500">
              <Icon name="errorCircle" color={colors.alert} />
            </span>
          </div>
        ) : (
          <select
            ref={ref}
            className={`${defaultSelectInputStyles} ${className} bg-white appearance-none pr-10`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={isRequired}
            data-invalid={!!error}
            style={{
              background: "none",
            }}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        <span className="pointer-events-none absolute right-3 top-10 text-gray-500">
          <Icon name="chevronDown" size={20} />
        </span>
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
