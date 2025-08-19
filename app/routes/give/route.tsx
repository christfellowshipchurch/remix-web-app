import { GiveFAQ } from "./partials/faq.partial";
import { Hero } from "./partials/hero.partial";
import { GivingImpact } from "./partials/impact.partial";
import { WaysToGive } from "./partials/ways-to-give.partial";
import { WhatBibleSaysAboutGiving } from "./partials/what-bible-says.partial";
import { WhyWeGive } from "./partials/why-we-give.partial";
import { loader } from "./loader";

export { loader };

export default function Give() {
  return (
    <div className="flex flex-col">
      <Hero />
      <WaysToGive />
      <GivingImpact />
      <WhyWeGive />
      <WhatBibleSaysAboutGiving />

      {/* Improve Finances Content Block? */}

      <GiveFAQ />
    </div>
  );
}
