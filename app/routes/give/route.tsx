import { GiveHero } from "./partials/give-hero.partial";
import { GivingImpact } from "./partials/impact.partial";
import { OtherWaysToGive } from "./partials/other-ways-to-give.partial";
import { WhatBibleSaysAboutGiving } from "./partials/what-bible-says.partial";
import { WhyWeGive } from "./partials/why-we-give.partial";
import { loader } from "./loader";
import { FAQsComponent } from "../page-builder/components/faq";
import { CardCarouselSection } from "~/components/resource-carousel";
import { giveFaqData, giveImproveFinancesData } from "./give-data";
import { FinanceCard } from "./components/finance-card";

export { loader };

export default function Give() {
  return (
    <div className="flex flex-col">
      <GiveHero />
      <OtherWaysToGive />
      <GivingImpact />
      <WhyWeGive />
      <WhatBibleSaysAboutGiving />

      {/* Improve Finances Content Block? */}
      <div className="w-full bg-navy text-white">
        <CardCarouselSection
          title="Looking to Improve Your Finances?"
          description="Classes and other resources"
          resources={giveImproveFinancesData}
          viewMoreStyles="!hidden"
          viewMoreLink="#hidden"
          CardComponent={FinanceCard}
        />
      </div>

      <div className="w-full -my-16">
        <FAQsComponent data={giveFaqData} />
      </div>
    </div>
  );
}
