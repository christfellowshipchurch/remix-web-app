import type { MetaFunction } from "react-router-dom";
import { HistorySection } from "./about/partials/history.partial";
import { BeliefsSection } from "./about/partials/beliefs.partial";
import { LeadershipSection } from "./about/partials/leadership.partial";
import { WhatWeOfferSection } from "./home/partials/what-we-offer.partial";
import { WhatToExpectSection } from "./home/partials/what-to-expect.partial";
import { AppSection } from "./home/partials/app.partial";
import { HeroSection } from "./home/partials/hero.partial";
import { Footer } from "../components";
import { AChanceSection } from "./home/partials/a-chance.partial";

export { loader } from "./home/loader"; // Using the about loader for the home page to grab author data for the leaders grid and scroll components

export const meta: MetaFunction = () => {
  return [
    { title: "Christ Fellowship Web App v3" },
    { name: "description", content: "Welcome to the CFDP!" },
  ];
};

export default function HomePage() {
  return (
    <div className="h-screen overflow-y-auto snap-y scroll-smooth no-scrollbar -mt-18 md:-mt-0">
      <HeroSection />
      <AChanceSection />
      <WhatWeOfferSection />
      <HistorySection sectionTitle="history" title="Who We Are" />
      <BeliefsSection />
      <WhatToExpectSection />
      <LeadershipSection className="lg:py-52" />
      <AppSection />
      <Footer />
    </div>
  );
}
