import { useState, useRef, useEffect, type ComponentProps } from "react";
import Icon from "~/primitives/icon";
import { cn } from "~/lib/utils";

type IconName = ComponentProps<typeof Icon>["name"];

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
  triggerClassName?: string;
  menuClassName?: string;
  chevronReflectsOpenState?: boolean;
  openTriggerClassName?: string;
  triggerIcon?: IconName;
  triggerIconClassName?: string;
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
  triggerClassName,
  menuClassName,
  chevronReflectsOpenState = false,
  openTriggerClassName,
  triggerIcon,
  triggerIconClassName,
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
        <label className="mb-2 block text-sm font-bold text-text-primary">
          {required && <span className="mr-1 text-ocean">*</span>}
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left text-text-primary shadow-sm transition-colors duration-200",
          error
            ? "border-alert"
            : "border-neutral-300 hover:border-neutral-400",
          disabled
            ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
            : "cursor-pointer",
          "focus:border-neutral-300 focus:outline-none focus:ring-0",
          triggerClassName,
          isOpen && !disabled && !error && openTriggerClassName,
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {triggerIcon ? (
            <Icon
              name={triggerIcon}
              size={16}
              className={cn(
                "shrink-0 transition-colors duration-300",
                triggerIconClassName,
                chevronReflectsOpenState &&
                  isOpen &&
                  !disabled &&
                  !error &&
                  "text-ocean",
              )}
              aria-hidden
            />
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              disabled ? "text-neutral-400" : "text-inherit",
            )}
          >
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <Icon
          name="chevronDown"
          className={cn(
            chevronColor,
            "shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
            disabled && "text-neutral-400",
            chevronReflectsOpenState &&
              isOpen &&
              !disabled &&
              !error &&
              "text-ocean",
          )}
        />
      </button>

      {error && <p className="mt-1 text-sm text-alert">{error}</p>}

      {isOpen && !disabled && (
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-[9999] mt-3 flex max-h-60 flex-col overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-lg md:mt-0",
            menuClassName,
          )}
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-neutral-500">
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
                      ? "cursor-not-allowed bg-neutral-50 text-neutral-400"
                      : value === option.value
                        ? "bg-ocean/10 font-medium text-ocean"
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
