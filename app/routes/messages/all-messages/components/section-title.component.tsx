export default function SectionTitle({
  title,
  sectionTitle,
}: {
  title: string;
  sectionTitle: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5">
        <div className="w-6 bg-ocean h-1 mb-4" />
        <h2 className="text-lg font-extrabold text-ocean mb-4">
          {sectionTitle}
        </h2>
      </div>
      <h1 className="text-[52px] font-bold text-gray-900 mb-8">{title}</h1>
    </div>
  );
}
