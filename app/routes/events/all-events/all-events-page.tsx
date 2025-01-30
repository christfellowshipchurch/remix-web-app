import { DynamicHero } from "~/components/dynamic-hero";
import { EventsForYou } from "./partials/events-for-you.partial";
import { FeaturedEvents } from "./partials/featured-events.partial";

export function AllEventsPage() {
  return (
    <div className="flex flex-col items-center">
      {/* We will remove the dynamic hero for now */}
      {/* <DynamicHero
        imagePath="../app/assets/images/events-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Call to Action" }]}
      /> */}
      <div className="px-5 md:px-12 lg:px-18 py-20">
        <div className="flex-col flex gap-8 max-w-screen-content">
          <FeaturedEvents />
          <EventsForYou />
        </div>
      </div>
    </div>
  );
}
