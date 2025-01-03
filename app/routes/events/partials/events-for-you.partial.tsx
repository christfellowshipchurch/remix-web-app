import { useLoaderData } from "react-router";
import { EventReturnType } from "../loader";
import SectionTitle from "~/components/section-title";
import { ContentCard } from "~/primitives/content-card/content.card.primitive";
import {
  FilterButtons,
  mockTags,
} from "~/routes/messages/partials/all-messages.partial";

export const EventsForYou = () => {
  const { upcomingEvents } = useLoaderData<EventReturnType>();

  return (
    <div className="flex flex-col py-20 gap-y-28">
      <SectionTitle
        title="Discover Events For You"
        sectionTitle="event for you."
      />
      {/* Placeholder for filter buttons */}
      <FilterButtons tags={mockTags} />
      <div className="grid grid-cols-3 gap-4 xl:gap-6 xxl:gap-16">
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
