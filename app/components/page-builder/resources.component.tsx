import { Button } from "~/primitives/button/button.primitive";
import { Event } from "~/routes/events/all-events/loader";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/primitives/shadcn-primitives/carousel";
import { ResourceCard } from "~/primitives/cards/resource-card";
interface PageBuilderResourcesProps {
  viewMoreLink: string;
  title: string;
  description: string;
  resources: Event[] | any[];
}

export const PageBuilderResourceComponent = ({
  title,
  viewMoreLink,
  description,
  resources,
}: PageBuilderResourcesProps) => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex w-full  flex-col items-center py-12 md:py-24">
        {/* Header */}
        <div className="w-full flex items-center justify-between pr-5 md:pr-12 lg:pr-18">
          <div className="flex flex-col gap-2">
            <h2 className="text-text font-extrabold text-[28px] lg:text-[32px] leading-tight">
              {title}
            </h2>
            <p className="text-lg">{description}</p>
          </div>

          <Button
            href={viewMoreLink}
            size="md"
            className="hidden md:block"
            intent="secondary"
          >
            View All
          </Button>
        </div>

        <ResourceCarousel resources={resources} />

        <Button
          href={viewMoreLink}
          size="md"
          className="md:hidden"
          intent="secondary"
        >
          View All
        </Button>
      </div>
    </div>
  );
};

export const ResourceCarousel = ({
  resources,
}: {
  // TODO: Update type any to Article | Message | Podcast, etc... ??
  resources: Event[] | any[];
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full mt-8 relative mb-12"
    >
      <CarouselContent className="gap-6 xl:gap-8 pt-4 2xl:pr-18">
        {resources.map((resource, index) => (
          <CarouselItem
            key={index}
            className="w-full basis-[75%] sm:basis-[45%] lg:basis-[30%] xl:basis-[33.33%] pl-0"
          >
            <ResourceCard resource={resource} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows */}
      <div className="absolute -bottom-12 left-0">
        <CarouselDots
          activeClassName="bg-ocean"
          inactiveClassName="bg-neutral-lighter"
        />
      </div>
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
