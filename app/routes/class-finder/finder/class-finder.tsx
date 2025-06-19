import { ClassSearch } from "./partials/class-search.partial";
import { ClassFinderHero } from "./partials/hero.component";

export function ClassFinderPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <ClassFinderHero />
      <ClassSearch />
    </div>
  );
}
