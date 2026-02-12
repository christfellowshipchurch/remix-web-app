import { GroupSearch } from "./partials/group-search.partial";
import { GroupFinderHero } from "./partials/hero.component";

export function GroupFinderPage() {
  return (
    <div className="flex flex-col min-h-[100svh]">
      <div className="flex-none">
        <GroupFinderHero />
      </div>
      <div className="flex flex-col flex-1 w-full">
        <GroupSearch />
      </div>
    </div>
  );
}
