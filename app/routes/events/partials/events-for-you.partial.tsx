import { useLoaderData } from "react-router";
import { EventReturnType } from "../loader";
import { EventCard } from "../components/EventCard.component";
import SectionTitle from "~/components/section-title";
import {
  mockTags,
  Tag,
} from "~/routes/messages/components/all-messages.component";

export const EventsForYou = () => {
  const { upcomingEvents } = useLoaderData<EventReturnType>();

  // TODO: Setup tagging and pagination
  const FilterButtons = ({ tags }: { tags: Tag[] }) => {
    return (
      <div className="h-14 justify-start items-center gap-6 inline-flex">
        {tags.map((tag, index) => (
          <div
            key={`${tag.label}-${index}`}
            className={`px-6 py-3 rounded-3xl justify-center items-center gap-2 flex cursor-pointer ${
              tag.isActive
                ? "border border-neutral-600 text-neutral-600"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <div className="text-xl font-semibold font-['Proxima Nova'] leading-7">
              {tag.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col py-20 gap-y-28">
      <SectionTitle
        sectionTitle="all events."
        title="Discover Events For You"
      />
      <FilterButtons tags={mockTags} />
      <div className="grid grid-cols-3 gap-4 xl:gap-6 xxl:gap-16">
        {upcomingEvents.map((event, i) => (
          <EventCard key={i} data={event} />
        ))}
      </div>
    </div>
  );
};
