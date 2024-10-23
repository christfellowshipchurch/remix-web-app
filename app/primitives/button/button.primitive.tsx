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
    "border-primary",
    "transition-colors",
    "delay-50",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-primary-500",
          "text-white",
          "hover:enabled:bg-primary-700",
        ],
        secondary: [
          "bg-transparent",
          "text-primary-500",
          "hover:enabled:bg-primary",
          "hover:enabled:text-white",
        ],
        white: ["bg-white", "text-primary", "hover:enabled:bg-[#D9D9D9]"],
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

export function Button({
  className,
  target,
  intent,
  href,
  onClick,
  size,
  underline,
  ...props
}: ButtonProps) {
  if (href && target !== "_blank") {
    return (
      <Link to={href}>
        <button
          className={twMerge(button({ intent, size, className, underline }))}
          {...props}
        >
          {props.children}
        </button>
      </Link>
    );
  } else if (href && target === "_blank") {
    return (
      <a href={href} target="_blank">
        <button
          className={twMerge(button({ intent, size, className, underline }))}
          {...props}
        >
          {props.children}
        </button>
      </a>
    );
  }

  return (
    <button
      className={twMerge(button({ intent, size, className, underline }))}
      onClick={onClick}
      {...props}
    >
      {props.children}
    </button>
  );
}
