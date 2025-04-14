import { type MetaFunction } from "react-router-dom";
import { DynamicHero } from "~/components/dynamic-hero";
import { MissionSection } from "./partials/mission.partial";
import { HistorySection } from "./partials/history.partial";
import { BeliefsSection } from "./partials/beliefs.partial";
import { LeadershipSection } from "./partials/leadership.partial";
import { ImpactSection } from "./partials/impact.partial";

export const meta: MetaFunction = () => {
  return [
    { title: "About Us | Christ Fellowship Church" },
    {
      name: "description",
      content:
        "Learn about Christ Fellowship Church, our mission, history, beliefs and leadership team.",
    },
  ];
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <DynamicHero
        customTitle="About Us"
        imagePath="/assets/images/events-hero-bg.jpg"
        ctas={[
          {
            title: "Beliefs",
            href: "#beliefs",
          },
          {
            title: "Leadership",
            href: "#leadership",
          },
        ]}
      />
      <MissionSection />
      <HistorySection />
      <BeliefsSection />
      <LeadershipSection />
      <ImpactSection />
    </main>
  );
}
