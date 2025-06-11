import { GroupSearch } from "./partials/group-search.partial";
import { GroupFinderHero } from "./partials/hero.component";

export function GroupFinderPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <GroupFinderHero />
      <GroupSearch />
    </div>
  );
}
