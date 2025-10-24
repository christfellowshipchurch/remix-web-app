import { GroupFAQ } from "./faq.component";

export function GroupSingleBasicContent({ summary }: { summary: string }) {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg md:text-2xl font-extrabold">About</h3>
        <p className="md:text-lg">{summary}</p>
      </div>

      <GroupFAQ />
    </div>
  );
}
