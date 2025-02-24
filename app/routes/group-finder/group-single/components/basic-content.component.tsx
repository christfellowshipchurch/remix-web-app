import { useLoaderData } from "react-router";
import type { LoaderReturnType } from "../loader";
import { GroupFAQ } from "./faq.component";

export function GroupSingleBasicContent() {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-extrabold">{data.groupName}</h1>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, i) => (
            <span key={i} className="text-sm bg-gray-100 px-2 py-1 rounded-sm">
              {tag}
            </span>
          ))}
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          Suspendisse varius enim in eros elementum tristique. Duis cursus, mi
          quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero
          vitae erat.
        </p>
      </div>
      <GroupFAQ />
    </div>
  );
}
