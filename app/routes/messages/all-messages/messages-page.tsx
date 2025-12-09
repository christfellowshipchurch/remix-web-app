import { DynamicHero } from "~/components";
import CurrentSeries from "./partials/current-series.partial";
import { AllMessages } from "./partials/all-messages.partial";

export function MessagesPage() {
  return (
    <div>
      <DynamicHero
        imagePath="/assets/images/messages-hero-bg.jpg"
        ctas={[
          {
            href: "https://www.youtube.com/@ChristFellowship.Church",
            title: "Watch Live",
            target: "_blank",
          },
        ]}
      />
      <CurrentSeries />
      <AllMessages />
    </div>
  );
}
