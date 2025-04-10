import { DynamicHero } from "~/components";
import { GroupSearch } from "./partials/group-search.partial";

export function GroupFinderPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="hidden lg:block w-full">
        <DynamicHero
          imagePath="/assets/images/groups-hero-bg.webp"
          ctas={[
            { title: "Lead a Group", href: "/lead-a-group" },
            { title: "Help me find a Group", href: "#search" },
          ]}
        />
      </div>
      <div className="block lg:hidden w-full">
        <DynamicHero
          imagePath="/assets/images/groups-hero-bg.webp"
          ctas={[
            { title: "Help me find a Group", href: "#search" },
            { title: "Lead a Group", href: "/lead-a-group" },
          ]}
        />
      </div>
      <div className="content-padding w-full">
        <GroupSearch />
      </div>
    </div>
  );
}
