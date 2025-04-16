import { useLoaderData } from "react-router";
import { EventReturnType } from "../loader";
import { SectionTitle } from "~/components";
import { ContentCard } from "~/primitives/content-card/content.card.primitive";
import {
  FilterButtons,
  mockTags,
} from "~/routes/messages/all-messages/components/all-messages.component";

export const EventsForYou = () => {
  const { upcomingEvents } = useLoaderData<EventReturnType>();

  return (
    <div className="flex flex-col py-20">
      <SectionTitle
        title="Discover Events For You"
        sectionTitle="all events."
      />
      {/* Placeholder for filter buttons */}
      <div className="mt-10 mb-16 md:mt-14 lg:mb-24 xl:mb-28">
        <FilterButtons tags={mockTags} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8 xl:gap-6 xxl:gap-16 place-items-center md:place-items-start">
        {upcomingEvents.map((event, i) => (
          <ContentCard
            key={i}
            image={event.image}
            title={event.title}
            subheadings={[
              { icon: "calendarAlt", title: event.date },
              { icon: "map", title: event.campus || "" },
            ]}
            cta={{
              title: "Learn More",
              href: `/events/${event.attributeValues.url.value}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
