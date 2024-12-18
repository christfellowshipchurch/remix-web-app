import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = ({
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`rounded-md bg-primary text-white px-4 py-2 ${
        size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : "text-base"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
