import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./button.primitive";
import Icon from "../icon";
import { icons } from "~/lib/icons";
import { twMerge } from "tailwind-merge";

type IconName = keyof typeof icons;

export interface IconButtonProps {
  /**
   * The text content of the button
   */
  children: React.ReactNode;
  /**
   * The path to navigate to (optional - if not provided, renders as button instead of link)
   */
  to?: string;
  /**
   * Whether to show the rotating arrow icon
   */
  withRotatingArrow?: boolean;
  /**
   * Additional CSS classes to apply to the button
   */
  className?: string;
  /**
   * The icon name to use (defaults to arrowBack for rotating arrow)
   */
  iconName?: IconName;
  /**
   * The size of the icon (defaults to 20)
   */
  iconSize?: number;
  /**
   * Text and border color
   */
  color?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  to,
  withRotatingArrow = false,
  className = "",
  iconName = "arrowBack",
  iconSize = 20,
  onClick,
}) => {
  const buttonStyles = twMerge(
    "font-semibold rounded-none",
    "hover:enabled:bg-current/10",
    !withRotatingArrow && "px-6 py-3",
    className
  );

  const iconStyles =
    "ml-[-0.75rem] text-white rounded-full p-2 rotate-[135deg] transition-transform duration-300 group-hover:rotate-180 size-10 bg-ocean";

  const ButtonContent = () => (
    <>
      <Button intent="secondary" className={buttonStyles} onClick={onClick}>
        {children}
      </Button>
      {withRotatingArrow && (
        <Icon name={iconName} className={iconStyles} size={iconSize} />
      )}
    </>
  );

  if (to) {
    return (
      <div className="group">
        <Link to={to} className="flex">
          <ButtonContent />
        </Link>
      </div>
    );
  }

  return (
    <div className="group">
      <div className="flex">
        <ButtonContent />
      </div>
    </div>
  );
};
