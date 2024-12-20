import { DynamicHero } from "~/components/dynamic-hero";
import { GroupSearch } from "./partials/GroupSearch.partial";

export function GroupFinder() {
  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="../app/assets/images/groups-hero-bg.jpg"
        ctas={[
          { title: "Lead a Group", href: "/lead-a-group" },
          { title: "Help me find a Group", href: "#search" },
        ]}
      />
      <GroupSearch />
    </div>
  );
}
