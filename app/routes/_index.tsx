import { useOutletContext, type MetaFunction } from "react-router-dom";
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
  const outletContext = useOutletContext<{
    homePageScroll?: React.RefObject<HTMLDivElement>;
  }>();
  const homePageScroll = outletContext?.homePageScroll ?? undefined;

  return (
    <>
      {/* White background for the home page */}
      <div className="w-screen h-screen absolute top-0 left-0 bg-white -z-100" />
      <div
        className="h-screen overflow-y-auto snap-y scroll-smooth no-scrollbar"
        ref={homePageScroll}
      >
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
    </>
  );
}
