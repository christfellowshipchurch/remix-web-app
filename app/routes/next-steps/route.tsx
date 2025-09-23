import type { MetaFunction } from "react-router-dom";
import { HeroSection } from "./partials/hero.partial";
import { NextStepsSection } from "./partials/next-steps.partial";
import { JourneySection } from "./partials/journey.partial";
import { FAQSection } from "./partials/faq.partial";
import { HelpSection } from "./partials/help.partial";

export const meta: MetaFunction = () => {
  return [
    { title: "Next Steps - Christ Fellowship Church" },
    {
      name: "description",
      content:
        "Find your next step at Christ Fellowship Church. Join a group, take a class, or serve with others.",
    },
  ];
};

export default function NextSteps() {
  return (
    <div className="flex flex-col items-center justify-center w-full pb-16 bg-gray-50">
      <HeroSection />
      <NextStepsSection />
      <JourneySection />
      <HelpSection />
      <FAQSection />
    </div>
  );
}
