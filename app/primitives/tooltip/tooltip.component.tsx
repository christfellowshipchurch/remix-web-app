import { useState, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  show?: boolean;
  onShowChange?: (show: boolean) => void;
}

export function Tooltip({
  children,
  content,
  position = "top",
  className,
  show = false,
  onShowChange,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(show);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && onShowChange) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onShowChange(false);
      }, 1500); // Hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onShowChange]);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            positionClasses[position],
            className
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 transform rotate-45",
              position === "top" && "top-full left-1/2 -translate-x-1/2 -mt-1",
              position === "bottom" &&
                "bottom-full left-1/2 -translate-x-1/2 -mb-1",
              position === "left" && "left-full top-1/2 -translate-y-1/2 -ml-1",
              position === "right" &&
                "right-full top-1/2 -translate-y-1/2 -mr-1"
            )}
          />
        </div>
      )}
    </div>
  );
}
