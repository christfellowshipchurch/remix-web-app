import { cn } from "~/lib/utils";
import {
  Carousel,
  CarouselArrows,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "~/primitives/shadcn-primitives/carousel";
import { beliefsData, spanishBeliefData } from "../about.data";

export function BeliefsCarousel({
  isSpanish = false,
  tabBgClass = "bg-dark-navy",
}: {
  tabBgClass?: string;
  isSpanish?: boolean;
}) {
  const data = isSpanish ? spanishBeliefData : beliefsData;

  return (
    <div className="z-30">
      <img
        src="/assets/images/about/beliefs.webp"
        alt="Beliefs"
        className="w-full"
      />
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full relative mb-12"
        >
          <CarouselContent>
            {data.map((belief, index) => (
              <CarouselItem
                key={belief.title}
                className={cn(
                  "pl-0",
                  "basis-[100%]",
                  "md:basis-[50%]",
                  "lg:basis-[33.333%]",
                )}
                data-belief-title={belief.title}
              >
                <div
                  className={cn(
                    "px-6 py-12 bg-gray h-full",
                    index !== data.length - 1 &&
                      "border-r border-neutral-lighter",
                  )}
                >
                  <h4 className="text-3xl text-text-primary font-extrabold mb-4">
                    {belief.title}
                  </h4>
                  <p className="text-lg text-dark-navy">{belief.verses}</p>
                  {belief.description && (
                    <p className="text-text-primary mt-4">
                      {belief.description}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div
            className={cn(
              "flex px-6 items-center justify-between h-18 w-full relative",
              tabBgClass ? tabBgClass : "bg-dark-navy",
            )}
          >
            <div className="absolute h-12 top-7 left-4">
              <CarouselDots
                activeClassName="bg-ocean"
                inactiveClassName="bg-neutral-lighter"
              />
            </div>

            <div
              className={cn(
                "absolute h-12 right-44 lg:right-44 2xl:right-36 3xl:right-28",
              )}
            >
              <CarouselArrows arrowStyles="text-white border-white hover:text-neutral-light hover:border-neutral-light bg-transparent transition-colors duration-300" />
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
