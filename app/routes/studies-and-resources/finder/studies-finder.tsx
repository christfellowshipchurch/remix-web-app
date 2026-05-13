import { StudiesSearch } from "./partials/studies-search.partial";
import FindersHero from "~/components/finders-hero";

export function StudiesFinderPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex-none">
        <div className="flex flex-col items-center w-full">
          <FindersHero
            title="Studies and Resources"
            sectionTitle="learn together"
            imageRight
            image="/assets/images/classes-hero.webp"
            imageAlt="Studies Hero"
            subtitle="Explore studies and resources designed to help you grow in your faith and strengthen your relationship with God and others. Study with a group, through a class, or on your own. "
            secondaryButton={{
              text: "Help me to find a Study",
              href: "#search",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full">
        <StudiesSearch />
      </div>
    </div>
  );
}
