import { GroupSearch } from "./partials/group-search.partial";
import { GroupFinderHero } from "./partials/hero.component";

export function GroupFinderPage() {
  return (
    <div className="flex min-h-[100svh] max-h-[100svh] flex-col overflow-hidden md:max-h-none md:min-h-0 md:overflow-visible">
      <div className="flex-none">
        <GroupFinderHero />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto md:overflow-visible">
        <div className="flex flex-col items-center w-full">
          <GroupSearch />
        </div>
      </div>
    </div>
  );
}
