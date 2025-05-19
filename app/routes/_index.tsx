import type { LoaderFunction, MetaFunction } from "react-router";
import { getUserFromRequest } from "~/lib/.server/authentication/get-user-from-request";
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

export const meta: MetaFunction = () => {
  return [
    { title: "Christ Fellowship Web App v3" },
    { name: "description", content: "Welcome to the CFDP!" },
  ];
};

/** Example of how to return current user via sever-side */
export const loader: LoaderFunction = async ({ request }) => {
  const userData = await getUserFromRequest(request);

  if (!userData) {
    return null; // here you can redirect to a login page etc.
  }

  return userData;
};

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="hidden lg:block w-full">
        <DesktopHeroSection />
      </div>
      <div className="block lg:hidden w-full">
        <MobileHeroSection />
        <BottomBar />
      </div>
      <AChanceSection />
      <WhatWeOfferSection />
      <HistorySection sectionTitle="History" title="Who We Are" />
      <BeliefsSection />
      <WhatToExpectSection />
      <LeadershipSection bg="white" />
      <AppSection />
    </div>
  );
}
