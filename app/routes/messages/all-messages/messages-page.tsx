import { DynamicHero } from "~/components";
import CurrentSeries from "./partials/current-series.partial";
import { AllMessages } from "./partials/all-messages.partial";

export function MessagesPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-none">
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
      </div>
      <CurrentSeries />
      <AllMessages />
    </div>
  );
}
