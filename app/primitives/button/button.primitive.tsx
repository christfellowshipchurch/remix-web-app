import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { Link } from "@remix-run/react";

const button = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-md",
    "text-center",
    "border",
    "transition-colors",
    "delay-50",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-ocean",
          "text-white",
          "border-transparent",
          "hover:enabled:bg-navy",
        ],
        secondary: [
          "bg-transparent",
          "text-ocean",
          "border-ocean",
          "hover:enabled:bg-ocean",
          "hover:enabled:text-white",
        ],
        white: ["bg-white", "text-ocean", "hover:enabled:bg-[#D9D9D9]"],
      },
      size: {
        sm: ["min-w-20", "h-full", "min-h-10", "text-sm", "px-4"],
        md: ["min-w-24", "h-full", "min-h-11", "px-6", "py-2"],
        lg: ["min-w-32", "h-full", "min-h-12", "text-lg", "px-6", "py-3"],
      },
      underline: { true: ["underline"], false: [] },
    },
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  underline?: boolean;
  href?: string;
  target?: string;
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, target, intent, href, onClick, size, underline, ...props },
    ref
  ) => {
    if (href) {
      return (
        <Link
          to={href}
          target={target ? target : href?.includes("http") ? "_blank" : ""}
        >
          <button
            className={twMerge(button({ intent, size, className, underline }))}
            ref={ref}
            {...props}
          >
            {props.children}
          </button>
        </Link>
      );
    }

    return (
      <button
        className={twMerge(button({ intent, size, className, underline }))}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
