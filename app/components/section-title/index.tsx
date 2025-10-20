/**
 * Section Title Component for our landing/hub pages and their different sections
 * */
export function SectionTitle({
  className,
  color,
  title,
  sectionTitle,
  leading,
}: {
  className?: string;
  title?: string;
  sectionTitle: string;
  leading?: string;
  color?: string;
}) {
  return (
    // TODO : Check with Austin if we need to add a horizontal layout for this as well
    <div className={`flex flex-col gap-8 ${className || ""}`}>
      <div className="flex items-center gap-5">
        <div
          className="w-6 h-1"
          style={{ backgroundColor: color || "#0092BC" }}
        />
        <h2
          className="text-lg font-extrabold leading-none"
          style={{ color: color || "#0092BC" }}
        >
          {sectionTitle}
        </h2>
      </div>
      {title && (
        <h1
          className={`text-2xl md:text-[40px] lg:text-[52px] font-bold text-text-primary ${
            leading || "leading-tight"
          }`}
        >
          {title}
        </h1>
      )}
    </div>
  );
}
