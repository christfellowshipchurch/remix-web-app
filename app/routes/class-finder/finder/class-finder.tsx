import { ClassSearch } from "./partials/class-search.partial";
import { FinderHero } from "~/components/finders/hero/hero.component";

export function ClassFinderPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex-none">
        <FinderHero
          bgColor="ocean"
          bgImage="/assets/images/classes-hero.webp"
          imageLeft={true}
          sectionTitle="learn together"
          sectionTitleColor="#004F71"
          title="Discover Classes For You"
          mobileDescription="From topics like building your faith, growing your marriage, finances, and more–there’s a class for you!"
          desktopDescription="Discover a class that will help give you practical steps to grow in your journey with God.
From topics like building your faith, growing your marriage, managing your finances, and more–there’s a class for you!"
        />
      </div>
      <div className="flex flex-col flex-1 w-full">
        <ClassSearch />
      </div>
    </div>
  );
}
