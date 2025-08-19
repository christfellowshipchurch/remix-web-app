import { GiveFAQ } from "./partials/give-faq.partial";
import { GiveHero } from "./partials/give-hero.partial";
import { GivingImpact } from "./partials/impact.partial";
import { OtherWaysToGive } from "./partials/other-ways-to-give.partial";
import { WhatBibleSaysAboutGiving } from "./partials/what-bible-says.partial";
import { WhyWeGive } from "./partials/why-we-give.partial";
import { loader } from "./loader";

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

      <GiveFAQ />
    </div>
  );
}
