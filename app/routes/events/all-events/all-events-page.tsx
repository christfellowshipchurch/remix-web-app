import { DynamicHero } from "~/components";
import { EventsForYou } from "./partials/events-for-you.partial";
import { FeaturedEvents } from "./partials/featured-events.partial";

export function AllEventsPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Update to Video Header */}
      <DynamicHero
        customTitle="Events"
        imagePath="/assets/images/events-hero-bg.jpg"
        ctas={[
          {
            href: "#cta",
            title: "Call to Action",
          },
        ]}
      />

      <FeaturedEvents />
      <EventsForYou />
    </div>
  );
}
