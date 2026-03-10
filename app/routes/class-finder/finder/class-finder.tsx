import { SectionTitle } from "~/components/section-title";
import { ClassSearch } from "./partials/class-search.partial";
import { Button } from "~/primitives/button/button.primitive";
import FindersHero from "~/components/finders-hero";

export function ClassFinderPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex-none">
        <div className="flex flex-col items-center w-full">
          <FindersHero
            title="Discover Classes For You"
            sectionTitle="learn together"
            subtitle="Christ Fellowship is a church in South Florida with a passion to help you know God and grow in your relationships so that you can discover your purpose and impact the world. We believe that church isn’t just a building you walk into, but a family you can belong to—so whether you call one of our many locations home or join from home, church is wherever you are! Led by senior pastors Todd & Julie Mullins, God has given us a vision to lead a radical transformation for Jesus Christ in this region and beyond. Everyone, Everyday, Everywhere."
            mobileSubtitle="Christ Fellowship is a church in South Florida with a passion to help you know God and grow in your relationships so that you can discover your purpose"
            image="/assets/images/classes-hero.webp"
            imageAlt="Classes Hero"
            button={{
              text: "Help me to find a Class",
              href: "#search",
            }}
            secondaryButton={{
              text: "Lead a Class",
              href: "#todo",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full">
        <ClassSearch />
      </div>
    </div>
  );
}
