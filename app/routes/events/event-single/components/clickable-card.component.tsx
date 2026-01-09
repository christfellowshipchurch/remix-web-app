import Icon from "~/primitives/icon";

interface ClickableCardProps {
  variant: "campus" | "eventType" | "date" | "time";
  icon: "map" | "group" | "calendarAlt" | "timeFive";
  title: string;
  subtitle?: string; // For campus, date, time
  description?: string; // For eventType
  buttonText?: string; // For eventType (dynamic)
  onClick: () => void;
}

export const ClickableCard = ({
  variant,
  icon,
  title,
  subtitle,
  description,
  buttonText,
  onClick,
}: ClickableCardProps) => {
  // Base card styles
  const baseCardClasses =
    "bg-white rounded-lg border border-neutral-lighter cursor-pointer hover:border-ocean transition-all duration-300 flex flex-col items-center";

  // Variant-specific styling
  if (variant === "campus") {
    return (
      <div
        onClick={onClick}
        className={`${baseCardClasses} px-6 pt-6 pb-3 gap-1 w-full md:w-[calc(33.333%-0.67rem)] max-w-[300px]`}
      >
        <div className="bg-navy-subdued rounded-lg p-3">
          <Icon name={icon} size={24} />
        </div>
        <h4 className="font-bold text-black text-center leading-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sm text-[#717182] text-center">
            {subtitle}, <br /> Florida
          </p>
        )}
      </div>
    );
  }

  if (variant === "eventType") {
    return (
      <div
        onClick={onClick}
        className={`${baseCardClasses} px-6 py-6 gap-3 w-full md:w-[calc(33.333%-0.67rem)] min-w-[320px]`}
      >
        {/* {icon && (
          <div className="bg-navy-subdued rounded-lg p-3">
            <Icon name={icon} size={24} />
          </div>
        )} */}
        <h4 className="font-semibold text-center leading-tight mb-0 mt-8">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-[#717182] text-center leading-relaxed mb-8">
            {description}
          </p>
        )}
        {buttonText && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="mt-auto w-full bg-ocean text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-ocean-dark transition-colors"
          >
            {buttonText}
          </button>
        )}
      </div>
    );
  }

  if (variant === "date") {
    return (
      <div
        onClick={onClick}
        className={`${baseCardClasses} px-6 pt-6 pb-3 gap-1 w-full md:w-[calc(33.333%-0.67rem)] max-w-[300px]`}
      >
        <Icon name={icon} size={24} className="text-black" />
        <h4 className="font-bold text-black text-center leading-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sm text-[#717182] text-center">{subtitle}</p>
        )}
      </div>
    );
  }

  if (variant === "time") {
    return (
      <div
        onClick={onClick}
        className={`${baseCardClasses} px-6 pt-6 pb-3 gap-1 w-full md:w-[calc(50%-0.5rem)] max-w-[300px]`}
      >
        <Icon name={icon} size={24} className="text-black" />
        <h4 className="font-bold text-black text-center leading-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sm text-[#717182] text-center">{subtitle}</p>
        )}
      </div>
    );
  }

  return null;
};
