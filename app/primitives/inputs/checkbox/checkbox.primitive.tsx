import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  labelClassName?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = "",
  labelClassName = "",
}) => {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none ${className}`}
    >
      <span className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer appearance-none w-5 h-5 border-1 border-ocean rounded-md transition-colors duration-150 bg-ocean/10 checked:bg-ocean checked:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean"
          aria-checked={checked}
        />
        <span
          className={`pointer-events-none absolute left-0 top-0 flex h-5 w-5 items-center justify-center transition-opacity duration-150 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 10.5L9 14L15 7"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <span
        className={
          labelClassName && labelClassName !== ""
            ? labelClassName
            : "text-text-primary font-normal"
        }
      >
        {label}
      </span>
    </label>
  );
};
