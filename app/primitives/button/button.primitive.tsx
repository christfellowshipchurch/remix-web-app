import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";

export const button = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "text-center",
    "border",
    "transition-colors",
    "delay-50",
    "rounded-md",
    "cursor-pointer",
    "font-semibold",
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
        lg: ["min-w-24", "h-full", "min-h-12", "text-lg", "px-6", "py-3"],
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
  linkClassName?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      linkClassName,
      className,
      target,
      intent,
      href,
      onClick,
      size,
      underline,
      ...props
    },
    ref
  ) => {
    if (href) {
      return (
        <Link
          to={href}
          prefetch="intent"
          target={target ? target : href?.includes("http") ? "_blank" : ""}
          className={`${linkClassName}`}
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
