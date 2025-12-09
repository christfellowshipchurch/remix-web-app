import { DynamicHero } from "~/components";
import CurrentSeries from "./components/current-series.component";
import { AllMessages } from "./components/all-messages.component";

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
