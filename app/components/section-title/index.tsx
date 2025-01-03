/**
 * Section Title Component for our landing/hub pages and their different sections
 * */
export default function SectionTitle({
  className,
  title,
  sectionTitle,
}: {
  className?: string;
  title?: string;
  sectionTitle: string;
}) {
  return (
    // TODO : Check with Austin if we need to add a horizontal layout for this as well
    <div className={`flex flex-col ${className || ""}`}>
      <div className="flex items-center gap-5">
        <div className="w-6 bg-ocean h-1 mb-4" />
        <h2 className="text-lg font-extrabold text-ocean mb-4">
          {sectionTitle}
        </h2>
      </div>
      {title && (
        <h1 className="text-[52px] font-bold text-text-primary">{title}</h1>
      )}
    </div>
  );
}
