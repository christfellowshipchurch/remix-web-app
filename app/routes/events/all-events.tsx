import { DynamicHero } from "~/components/dynamic-hero";
import { Event, EventReturnType } from "./loader";
import { LargeCard } from "./components/LargeCard.component";
import { useLoaderData } from "react-router";
import { EventsForYou } from "./partials/EventsForYou.partial";
import { EventCard } from "./components/EventCard.component";

export function AllEventsPage() {
  const { featuredEvents } = useLoaderData<EventReturnType>();
  const firstEvent = featuredEvents[0];
  const otherEvents = featuredEvents.slice(1);

  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="../app/assets/images/events-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Call to Action" }]}
      />
      <div className="flex-col flex gap-8 max-w-[1600px] md:px-8 py-28">
        {/* Featured Events */}
        <div className="flex flex-col gap-16">
          <LargeCard card={firstEvent} />
          <div className="flex w-full justify-between">
            {otherEvents.map((event, i) => (
              <EventCard key={i} data={event} />
            ))}
          </div>
        </div>
        {/* Events for you */}
        <EventsForYou />
      </div>
    </div>
  );
}
