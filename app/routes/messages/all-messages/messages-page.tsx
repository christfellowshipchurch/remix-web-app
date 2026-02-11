import { DynamicHero } from "~/components";
import CurrentSeries from "./partials/current-series.partial";
import { AllMessages } from "./partials/all-messages.partial";

export function MessagesPage() {
  return (
    <div className="flex min-h-[100svh] max-h-[100svh] flex-col overflow-hidden md:max-h-none md:min-h-0 md:overflow-visible">
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
      <div className="min-h-0 flex-1 overflow-y-auto md:overflow-visible">
        <CurrentSeries />
        <AllMessages />
      </div>
    </div>
  );
}
