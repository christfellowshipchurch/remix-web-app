import { cn } from "~/lib/utils";
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

export const ResourceCarouselSection = ({
  className,
  title,
  description,
  resources,
  viewMoreLink,
}: {
  className?: string;
  title: string;
  description: string;
  resources: any[];
  viewMoreLink: string;
}) => {
  return (
    <div className={cn("w-full pl-5 md:pl-12 lg:pl-18", className)}>
      <div className="flex flex-col max-w-screen-content mx-auto">
        <PageBuilderCarouselResource
          title={title}
          description={description}
          resources={resources}
          viewMoreLink={viewMoreLink}
        />
      </div>
    </div>
  );
};

interface PageBuilderResourcesProps {
  viewMoreLink: string;
  title: string;
  description: string;
  resources: Event[] | any[];
}

export const PageBuilderCarouselResource = ({
  title,
  viewMoreLink,
  description,
  resources,
}: PageBuilderResourcesProps) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col items-center py-16 md:py-24 lg:py-28">
        {/* Header */}
        <div className="w-full flex items-center justify-between pr-5 md:pr-12 lg:pr-18">
          <div className="flex flex-col gap-2">
            <h2 className="text-text font-extrabold text-[40px] md:text-[32px] leading-tight">
              {title}
            </h2>
            <p className="md:text-lg">{description}</p>
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

        {/* Mobile View All */}
        <div className="w-full flex justify-start mt-8">
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
            className="w-full basis-[75%] sm:basis-[45%] lg:basis-[33.33%] xl:basis-[30%] 2xl:basis-[33.33%] pl-0"
          >
            <ResourceCard resource={resource} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Dots */}
      <div className="absolute -bottom-12 left-0">
        <CarouselDots
          activeClassName="bg-ocean"
          inactiveClassName="bg-neutral-lighter"
        />
      </div>

      {/* Arrows */}
      <div className="absolute right-24 -bottom-10">
        <CarouselPrevious
          className="cursor-pointer left-0 border-ocean text-ocean disabled:border-[#AAAAAA] hover:border-navy hover:text-navy"
          disabledFill="#AAAAAA"
        />
        <CarouselNext
          className="cursor-pointer left-12 border-ocean text-ocean disabled:border-[#AAAAAA] hover:border-navy hover:text-navy"
          disabledFill="#AAAAAA"
        />
      </div>
    </Carousel>
  );
};
