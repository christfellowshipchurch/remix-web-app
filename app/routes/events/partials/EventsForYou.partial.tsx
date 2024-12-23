import { useLoaderData } from "react-router";
import { EventReturnType } from "../loader";
import { EventCard } from "../components/EventCard.component";

export const EventsForYou = () => {
  const { upcomingEvents } = useLoaderData<EventReturnType>();

  // TODO: Setup tagging and pagination
  return (
    <div className="flex flex-col items-center py-20 gap-y-28">
      <h2 className="font-extrabold text-[52px]">Discover Events For You</h2>
      <div className="grid grid-cols-3 gap-[75px]">
        {upcomingEvents.map((event, i) => (
          <EventCard key={i} data={event} />
        ))}
      </div>
    </div>
  );
};
