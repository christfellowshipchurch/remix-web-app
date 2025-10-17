// import { useLoaderData } from "react-router-dom";
// import type { LoaderReturnType } from "../loader";
import { GroupFAQ } from "./faq.component";

export function GroupSingleBasicContent({
  tags: _tags,
  groupName: _groupName,
  summary,
}: {
  tags: string[];
  groupName: string;
  summary: string;
}) {
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
