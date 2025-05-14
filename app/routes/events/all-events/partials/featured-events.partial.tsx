import { FeaturedCard } from "../components/featured-card.component";
import { useLoaderData } from "react-router";
import { SectionTitle } from "~/components";
import { EventReturnType } from "../loader";
import { EventCard } from "~/primitives/cards/event-card";

export function FeaturedEvents() {
  const { featuredEvents } = useLoaderData<EventReturnType>();
  const featuredEvent = featuredEvents[0]; //TODO : We need still determine how we want to define a featured event from our platform. Just grabbing first one for now
  const otherEvents = featuredEvents.slice(1);
  return (
    <div className="w-full py-28 bg-gray content-padding">
      <div className="flex flex-col max-w-screen-content mx-auto">
        <FeaturedCard card={featuredEvent} />
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-16 place-items-center md:place-items-start">
          {otherEvents.map((event, i) => (
            <EventCard key={i} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
