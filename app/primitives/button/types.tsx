import { icons } from "~/lib/icons";

export type IconName = keyof typeof icons;

export type BaseIconButtonProps = {
  /**
   * The text content of the button
   */
  children: React.ReactNode;
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
};
