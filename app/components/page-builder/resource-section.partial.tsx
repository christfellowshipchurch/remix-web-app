import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import {
  Carousel,
  CarouselArrows,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "~/primitives/shadcn-primitives/carousel";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { CollectionItem } from "~/routes/page-builder/types";

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
  resources: CollectionItem[];
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
  resources: CollectionItem[];
}

const PageBuilderCarouselResource = ({
  title,
  viewMoreLink,
  description,
  resources,
}: PageBuilderResourcesProps) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col items-center py-16 md:py-24 lg:py-28">
        {/* Header */}
        <div className="w-full flex items-end justify-between pr-5 md:pr-12 lg:pr-18">
          <div className="flex flex-col gap-2">
            <h2 className="heading-h2 text-[40px] md:text-[32px]">{title}</h2>
            <p className="md:text-lg mt-3">{description}</p>
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

        <div className="w-full max-w-full overflow-hidden">
          <ResourceCarousel resources={resources} />
        </div>

        {/* Mobile View All */}
        <div className="w-full flex justify-start mt-8 md:hidden">
          <Button href={viewMoreLink} size="md" intent="secondary">
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
  resources: CollectionItem[];
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
    >
      <CarouselContent className="gap-6 pt-4 md:mt-20 xl:gap-8 2xl:pr-18">
        {resources.map((resource, index) => (
          <CarouselItem
            key={index}
            className="w-full basis-[75%] sm:basis-[45%] lg:basis-[31.33%] xl:basis-[30%] 2xl:basis-[33.33%] pl-0"
          >
            <ResourceCard resource={resource} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div
        className={cn("w-full relative mt-16 pb-8", {
          "lg:mt-0 lg:pb-0": resources.length < 4,
        })}
      >
        <div className="absolute h-8 top-4 left-0">
          <CarouselDots
            activeClassName="bg-ocean"
            inactiveClassName="bg-neutral-lighter"
          />
        </div>

        <div className="absolute h-8 right-34">
          <CarouselArrows />
        </div>
      </div>
    </Carousel>
  );
};
