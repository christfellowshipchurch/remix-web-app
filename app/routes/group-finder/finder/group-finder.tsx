import { DynamicHero } from "~/components";
import { GroupSearch } from "./partials/group-search.partial";

export function GroupFinderPage() {
  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="/assets/images/groups-hero-bg.webp"
        ctas={[
          { title: "Lead a Group", href: "/lead-a-group" },
          { title: "Help me find a Group", href: "#search" },
        ]}
      />
      <div className="px-5 sm:px-12 lg:px-18">
        <GroupSearch />
      </div>
    </div>
  );
}
