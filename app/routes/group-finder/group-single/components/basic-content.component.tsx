import { useLoaderData } from "react-router-dom";
import type { LoaderReturnType } from "../loader";
import { GroupFAQ } from "./faq.component";

export function GroupSingleBasicContent({
  tags,
  groupName,
  summary,
}: {
  tags: string[];
  groupName: string;
  summary: string;
}) {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col md:gap-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] lg:text-[52px] font-extrabold leading-tight">
            {groupName}
          </h1>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-sm bg-gray-100 px-2 py-1 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="hidden md:block">{summary}</p>
      </div>
      <div className="hidden lg:block">
        <GroupFAQ />
      </div>
    </div>
  );
}
