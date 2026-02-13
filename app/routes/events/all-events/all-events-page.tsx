import { DynamicHero } from "~/components";

import { FeaturedEvents } from "./partials/featured-events.partial";
import { AllEvents } from "./partials/all-events";

export function AllEventsPage() {
  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        customTitle="Events"
        imagePath="/assets/images/events-hero-bg.jpg"
      />
      <FeaturedEvents />
      <AllEvents />
    </div>
  );
}
