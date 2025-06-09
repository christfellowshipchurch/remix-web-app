import type { MetaFunction } from "react-router";
import { HistorySection } from "./about/partials/history.partial";
import { BeliefsSection } from "./about/partials/beliefs.partial";
import { LeadershipSection } from "./about/partials/leadership.partial";
import { WhatWeOfferSection } from "./home/partials/what-we-offer.partial";
import { WhatToExpectSection } from "./home/partials/what-to-expect.partial";
import { AChanceSection } from "./home/partials/a-chance.partial";
import { AppSection } from "./home/partials/app.partial";
import {
  DesktopHeroSection,
  MobileHeroSection,
  BottomBar,
} from "./home/partials/hero.partial";
import { useOutletContext } from "react-router-dom";

export { loader } from "./home/loader"; // Using the about loader for the home page to grab author data for the leaders grid and scroll components

export const meta: MetaFunction = () => {
  return [
    { title: "Christ Fellowship Web App v3" },
    { name: "description", content: "Welcome to the CFDP!" },
  ];
};

export default function Index() {
  const outletContext = useOutletContext<{
    heroScrollRef?: React.RefObject<HTMLDivElement>;
  }>();
  const heroScrollRef = outletContext?.heroScrollRef ?? undefined;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Scroll snap container for hero and chance sections */}
      <div
        ref={heroScrollRef}
        className="w-full h-screen overflow-y-auto lg:snap-y lg:snap-mandatory no-scrollbar mt-[-82px] lg:mt-0"
      >
        <div className="hidden lg:block w-full snap-start">
          <DesktopHeroSection />
        </div>
        <div className="block lg:hidden w-full snap-start">
          <MobileHeroSection />
          <BottomBar />
        </div>
        <div className="w-full snap-start">
          <AChanceSection />
        </div>
      </div>
      {/* The rest of your sections (not snapped) */}
      <WhatWeOfferSection />
      <HistorySection sectionTitle="History" title="Who We Are" />
      <BeliefsSection />
      <WhatToExpectSection />
      <LeadershipSection bg="white" />
      <AppSection />
    </div>
  );
}
