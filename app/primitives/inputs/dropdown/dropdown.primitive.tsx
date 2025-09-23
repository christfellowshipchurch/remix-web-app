import { useState, useRef, useEffect } from "react";
import Icon from "~/primitives/icon";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  chevronColor?: string;
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  error,
  label,
  required = false,
  chevronColor = "text-neutral-500",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const handleOptionSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block font-bold text-text-primary text-sm mb-2">
          {required && <span className="text-ocean mr-1">*</span>}
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          flex items-center justify-between w-full px-4 py-3 text-left bg-white border rounded-lg shadow-sm transition-colors duration-200
          ${
            error
              ? "border-alert"
              : "border-neutral-300 hover:border-neutral-400"
          }
          ${
            disabled
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "cursor-pointer"
          }
          focus:outline-none focus:ring-0 focus:border-neutral-300
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
      >
        <span
          className={`truncate ${
            disabled ? "text-neutral-400" : "text-text-primary"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>
        <Icon
          name="chevronDown"
          className={`${chevronColor} transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${disabled ? "text-neutral-400" : ""}`}
        />
      </button>

      {error && <p className="mt-1 text-sm text-alert">{error}</p>}

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-3 md:mt-0 z-[9999] bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto flex flex-col">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-neutral-500 text-sm">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleOptionSelect(option)}
                className={`
                  w-full px-4 py-3 text-left transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg
                  ${
                    option.disabled
                      ? "text-neutral-400 cursor-not-allowed bg-neutral-50"
                      : value === option.value
                      ? "bg-ocean/10 text-ocean font-medium"
                      : "text-text-primary hover:bg-neutral-50"
                  }
                `}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
