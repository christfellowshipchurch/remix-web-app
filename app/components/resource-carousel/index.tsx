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

interface CardCarouselSectionProps {
  viewMoreStyles?: string;
  viewMoreLink: string;
  viewMoreText?: string;
  title: string;
  description: string;
  resources: CollectionItem[];
  mode?: "dark" | "light";
  CardComponent?: React.ComponentType<{
    resource: CollectionItem;
  }>;
  className?: string;
  backgroundImage?: string;
}

export const CardCarouselSection = ({
  CardComponent,
  className,
  backgroundImage,
  title,
  description,
  resources,
  viewMoreStyles,
  viewMoreLink,
  viewMoreText = "View All",
  mode = "light",
}: CardCarouselSectionProps) => {
  return (
    <div
      className={cn("w-full md:pl-12 lg:pl-18 2xl:!pl-0", className)}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="flex flex-col max-w-screen-content mx-auto">
        <div className="w-full flex justify-center">
          <div className="w-full flex flex-col items-center gap-12 lg:gap-20 py-16 md:py-24 lg:py-28">
            {/* Header */}
            <div className="pl-5 md:pl-0 w-full flex items-end justify-between pr-5 md:pr-12 lg:pr-18 2xl:!pr-8 3xl:!pr-0">
              <div
                className={cn(
                  "flex flex-col w-full gap-2",
                  mode === "dark" && "text-white"
                )}
              >
                <h2 className="heading-h2 text-[24px] md:text-[52px] font-extrabold leading-tight">
                  {title}
                </h2>
                <p className="md:text-lg leading-none">{description}</p>
              </div>

              <Button
                href={viewMoreLink}
                size="md"
                className={cn(
                  "hidden md:block min-w-28 w-fit",
                  mode === "dark" &&
                    "text-white border-white hover:!bg-white/10",
                  viewMoreStyles
                )}
                intent="secondary"
              >
                {viewMoreText}
              </Button>
            </div>

            <div className="w-full max-w-full text-text-primary">
              <CardCarousel
                resources={resources}
                mode={mode}
                CardComponent={CardComponent}
              />
            </div>

            {/* Mobile View All */}
            <div className="pl-5 md:pl-0 w-full flex justify-start mt-8 md:hidden">
              <Button
                href={viewMoreLink}
                size="md"
                className={cn(
                  mode === "dark" && "text-white border-white",
                  viewMoreStyles
                )}
                intent="secondary"
              >
                {viewMoreText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardCarousel = ({
  CardComponent,
  resources,
  mode,
  layout = "arrowsRight",
  carouselItemClassName,
  carouselClassName,
}: {
  CardComponent?: React.ComponentType<{
    resource: CollectionItem;
  }>;
  resources: CollectionItem[];
  mode?: "dark" | "light";
  layout?: "arrowsRight" | "arrowsLeft";
  carouselItemClassName?: string;
  carouselClassName?: string;
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className={carouselClassName}
    >
      <CarouselContent className="pt-3 gap-6 xl:gap-8 2xl:pr-18">
        {resources.map((resource, index) => (
          <CarouselItem
            key={index}
            className={cn(
              carouselItemClassName
                ? carouselItemClassName
                : "w-full basis-[75%] sm:basis-[45%] lg:basis-[31.33%] xl:basis-[30%] 2xl:basis-[33.33%]",
              index === 0 ? "ml-5 md:ml-0" : "ml-0",
              index === resources.length - 1
                ? "mr-5 md:mr-12 lg:mr-18 2xl:!mr-0"
                : "pr-0"
            )}
          >
            {CardComponent ? (
              <CardComponent resource={resource} />
            ) : (
              <ResourceCard
                resource={resource}
                className={mode === "dark" ? "border-none" : undefined}
              />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>

      <div
        className={cn("w-full relative mt-12 md:mt-16 pb-4 md:pb-8", {
          "lg:mt-0 lg:pb-0": resources.length < 4,
        })}
      >
        {layout === "arrowsLeft" ? (
          <>
            <div className={cn("absolute h-12 left-5 md:left-0")}>
              <CarouselArrows
                arrowStyles={
                  mode === "dark"
                    ? "text-white border-white hover:text-neutral-light hover:border-neutral-light"
                    : undefined
                }
              />
            </div>

            <div className="absolute h-12 top-7 right-44 lg:right-44 2xl:right-36 3xl:right-28">
              <CarouselDots
                activeClassName={mode === "dark" ? "bg-white" : "bg-ocean"}
                inactiveClassName="bg-neutral-lighter"
              />
            </div>
          </>
        ) : (
          <>
            <div className="absolute h-12 top-7 left-5 md:left-0">
              <CarouselDots
                activeClassName={mode === "dark" ? "bg-white" : "bg-ocean"}
                inactiveClassName="bg-neutral-lighter"
              />
            </div>

            <div
              className={cn(
                "absolute h-12 right-44 lg:right-44 2xl:right-36 3xl:right-28"
              )}
            >
              <CarouselArrows
                arrowStyles={
                  mode === "dark"
                    ? "text-white border-white hover:text-neutral-light hover:border-neutral-light"
                    : undefined
                }
              />
            </div>
          </>
        )}
      </div>
    </Carousel>
  );
};
