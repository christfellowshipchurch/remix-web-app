import { useLoaderData } from "react-router";
import { EventReturnType } from "../loader";
import { SectionTitle } from "~/components";
import {
  FilterButtons,
  mockTags,
} from "~/routes/messages/all-messages/components/all-messages.component";
import { ResourceCard } from "~/primitives/cards/resource-card";

export const EventsForYou = () => {
  const { upcomingEvents } = useLoaderData<EventReturnType>();

  return (
    <div className="w-full pt-16 pb-28 content-padding">
      <div className="flex flex-col max-w-screen-content mx-auto">
        <SectionTitle
          title="Discover Events For You"
          sectionTitle="all events."
        />
        {/* Placeholder for filter buttons */}
        <div className="mt-10 mb-16 md:mt-14 lg:mb-24 xl:mb-28">
          <FilterButtons tags={mockTags} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center md:place-items-start">
          {upcomingEvents.map((event, i) => (
            <ResourceCard
              key={i}
              resource={{
                id: event.id,
                contentChannelId: "78", // EVENT type from builder-utils.ts
                contentType: "EVENT",
                name: event.title,
                summary: event.attributeValues.summary.value,
                image: event.image,
                pathname: event.attributeValues.url.value,
                startDate: event.startDate,
                location: event.campus,
                attributeValues: {
                  summary: event.attributeValues.summary.value,
                  image: event.attributeValues.image.value,
                  url: event.attributeValues.url.value,
                  campus: event.attributeValues.campus?.value || null,
                },
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
