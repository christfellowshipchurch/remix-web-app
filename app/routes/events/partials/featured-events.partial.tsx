import { EventReturnType } from "../loader";
import { FeaturedCard } from "../components/featured-card.component";
import { ContentCard } from "~/primitives/content-card/content.card.primitive";
import { useLoaderData } from "react-router";
import SectionTitle from "~/components/section-title";

export function FeaturedEvents() {
  const { featuredEvents } = useLoaderData<EventReturnType>();
  const featuredEvent = featuredEvents[0]; //TODO : We need still determine how we want to define a featured event from our platform. Just grabbing first one for now
  const otherEvents = featuredEvents.slice(1);
  return (
    <div className="flex flex-col gap-16">
      <SectionTitle sectionTitle="featured events." />
      <FeaturedCard card={featuredEvent} />
      <div className="grid grid-cols-3 gap-4 xl:gap-16">
        {otherEvents.map((event, i) => (
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
              href: `/events/${event.url}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
