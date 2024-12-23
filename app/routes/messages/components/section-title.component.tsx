import { SectionDescription } from "./section-description.component";

export default function SectionTitle({
  title,
  sectionTitle,
}: {
  title: string;
  sectionTitle: string;
}) {
  return (
    <div className="flex flex-col">
      <SectionDescription title={sectionTitle} />
      <h1 className="text-[52px] font-bold text-gray-900 mb-8">{title}</h1>
    </div>
  );
}
