import { EventsForYou } from "./partials/events-for-you.partial";
import { FeaturedEvents } from "./partials/featured-events.partial";

export function AllEventsPage() {
  return (
    <div className="flex flex-col items-center">
      {/* blue gradient section */}
      <div className="absolute z-0 top-0 left-0 w-full h-[400px] bg-[linear-gradient(150.28deg,#1C3647_0.28%,#004F71_92%)]" />
      <div className="content-padding py-20">
        <div className="flex-col flex gap-8 max-w-screen-content">
          <FeaturedEvents />
          <EventsForYou />
        </div>
      </div>
    </div>
  );
}
