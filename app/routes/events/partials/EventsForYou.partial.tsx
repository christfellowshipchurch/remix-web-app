import { useLoaderData } from "react-router";
import { EventReturnType } from "../loader";
import { EventCard } from "../components/EventCard.component";
import { SectionDescription } from "~/routes/messages/components/section-description.component";

export const EventsForYou = () => {
  const { upcomingEvents } = useLoaderData<EventReturnType>();

  // TODO: Setup tagging and pagination
  return (
    <div className="flex flex-col items-center py-20 gap-y-28">
      <div className="flex">
        <SectionDescription title="all events." />
        <h2 className="font-extrabold text-[52px]">Discover Events For You</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 xl:gap-6 xxl:gap-16">
        {upcomingEvents.map((event, i) => (
          <EventCard key={i} data={event} />
        ))}
      </div>
    </div>
  );
};
