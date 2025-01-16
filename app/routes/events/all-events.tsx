import { DynamicHero } from "~/components/dynamic-hero";
import { EventsForYou } from "./partials/events-for-you.partial";
import { FeaturedEvents } from "./partials/featured-events.partial";

export function AllEventsPage() {
  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="../app/assets/images/events-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Call to Action" }]}
      />
      <div className="flex-col flex gap-8 max-w-6xl mx-8 py-28">
        <FeaturedEvents />
        <EventsForYou />
      </div>
    </div>
  );
}
