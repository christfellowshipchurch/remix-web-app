import { lazy, Suspense, type ReactNode } from "react";
import type { LinksFunction } from "react-router";
import { type MetaFunction } from "react-router-dom";
import { WhatWeOfferSection } from "./home/partials/what-we-offer.partial";
import { HeroSection } from "./home/partials/hero.partial";
import { AChanceSection } from "./home/partials/a-chance.partial";
import { createMeta } from "~/lib/meta-utils";

export { loader } from "./home/loader";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: "/assets/images/home/bg-vid.webp",
    as: "image",
    fetchPriority: "high",
  },
];

export const meta: MetaFunction = () => {
  return createMeta({
    title: "Christ Fellowship Church | Get the Most Out of Life",
    description:
      "Christ Fellowship Church is a multisite church in South Florida and online. Find services, groups, classes, and ways to grow in faith and serve your community.",
    path: "/",
  });
};

const HistorySectionLazy = lazy(async () => {
  const m = await import("./about/partials/history.partial");
  return { default: m.HistorySection };
});

const BeliefsSectionLazy = lazy(async () => {
  const m = await import("./about/partials/beliefs.partial");
  return { default: m.BeliefsSection };
});

const WhatToExpectSectionLazy = lazy(async () => {
  const m = await import("./home/partials/what-to-expect.partial");
  return { default: m.WhatToExpectSection };
});

const LeadershipSectionLazy = lazy(async () => {
  const m = await import("./about/partials/leadership.partial");
  return { default: m.LeadershipSection };
});

const DownloadAppSectionLazy = lazy(async () => {
  const m = await import("./home/partials/download-app.partial");
  return { default: m.DownloadAppSection };
});

function HomeBelowFoldFallback() {
  return (
    <div
      className="min-h-[24rem] w-full bg-gray-100 animate-pulse"
      aria-hidden
    />
  );
}

function HomeBelowFold({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<HomeBelowFoldFallback />}>{children}</Suspense>
  );
}

export default function HomePage() {
  return (
    <>
      <div className="w-screen h-screen absolute top-0 left-0 bg-white -z-100" />
      <HeroSection />
      <AChanceSection />
      <WhatWeOfferSection />
      <HomeBelowFold>
        <HistorySectionLazy sectionTitle="history" title="Who We Are" />
        <BeliefsSectionLazy />
        <WhatToExpectSectionLazy />
        <LeadershipSectionLazy className="lg:py-52" />
        <DownloadAppSectionLazy />
      </HomeBelowFold>
    </>
  );
}
