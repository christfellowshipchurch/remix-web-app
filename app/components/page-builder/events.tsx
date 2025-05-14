import { Button } from "~/primitives/button/button.primitive";
import { Event } from "~/routes/events/all-events/loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/primitives/shadcn-primitives/carousel";
import { EventCard } from "~/primitives/cards/event-card";
import { mockEvents } from "./events-mock-data";
interface EventResourcesProps {
  viewMoreLink: string;
  description: string;
  events: Event[];
}

export const EventsResources = ({
  viewMoreLink = "/events",
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  events = mockEvents,
}: EventResourcesProps) => {
  return (
    <div className="bg-white w-full flex justify-center content-padding">
      <div className="flex w-full  flex-col items-center py-12 md:py-24 max-w-screen-content">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-text font-extrabold text-[28px] lg:text-[32px] leading-tight">
              Events
            </h2>
            <p className="text-lg">{description}</p>
          </div>

          <Button
            href={viewMoreLink}
            size="md"
            className="hidden lg:block"
            intent="secondary"
          >
            View All
          </Button>
        </div>
        <EventsCarousel events={events} />
      </div>
    </div>
  );
};

export const EventsCarousel = ({ events }: { events: Event[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full mt-8 relative mb-12"
    >
      {/* Missing Dots */}
      <CarouselContent className="gap-8">
        {events.map((event, index) => (
          <CarouselItem
            key={index}
            className="w-full basis-[75%] sm:basis-[50%] lg:basis-[31.5%] pl-0"
          >
            <EventCard event={event} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="absolute right-24 -bottom-10">
        <CarouselPrevious
          className="left-0 border-ocean disabled:border-[#AAAAAA]"
          fill="#0092BC"
          disabledFill="#AAAAAA"
        />
        <CarouselNext
          className="left-12 border-ocean disabled:border-[#AAAAAA]"
          fill="#0092BC"
          disabledFill="#AAAAAA"
        />
      </div>
    </Carousel>
  );
};
