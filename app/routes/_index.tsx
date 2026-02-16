import { type MetaFunction } from "react-router-dom";
import { HistorySection } from "./about/partials/history.partial";
import { BeliefsSection } from "./about/partials/beliefs.partial";
import { LeadershipSection } from "./about/partials/leadership.partial";
import { WhatWeOfferSection } from "./home/partials/what-we-offer.partial";
import { WhatToExpectSection } from "./home/partials/what-to-expect.partial";
import { AppSection } from "./home/partials/app.partial";
import { HeroSection } from "./home/partials/hero.partial";
import { AChanceSection } from "./home/partials/a-chance.partial";
import { createMeta } from "~/lib/meta-utils";

export { loader } from "./home/loader"; // Using the about loader for the home page to grab author data for the leaders grid and scroll components

export const meta: MetaFunction = () => {
  return createMeta({
    title: "Christ Fellowship Church | Get the Most Out of Life",
    description:
      "Christ Fellowship Church is a multisite church in South Florida and online. Find services, groups, classes, and ways to grow in faith and serve your community.",
    path: "/",
  });
};

export default function HomePage() {
  return (
    <>
      {/* White background for the home page */}
      <div className="w-screen h-screen absolute top-0 left-0 bg-white -z-100" />
      <HeroSection />
      <AChanceSection />
      <WhatWeOfferSection />
      <HistorySection sectionTitle="history" title="Who We Are" />
      <BeliefsSection />
      <WhatToExpectSection />
      <LeadershipSection className="lg:py-52" />
      <AppSection />
    </>
  );
}
