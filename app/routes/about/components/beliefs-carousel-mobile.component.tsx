import { cn } from "~/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "~/primitives/shadcn-primitives/carousel";
import { beliefsData } from "../about.data";
import Icon from "~/primitives/icon";

const BeliefsMobilePagination = () => {
  const {
    currentSlide,
    scrollNext,
    scrollPrev,
    api,
    canScrollNext,
    canScrollPrev,
  } = useCarousel();
  const totalSlides = beliefsData.length;
  const visibleButtons = 5;

  // Calculate the start index of the visible buttons window
  const getStartIndex = () => {
    if (currentSlide <= 2) return 0;
    if (currentSlide >= totalSlides - 3) return totalSlides - visibleButtons;
    return currentSlide - 2;
  };

  const startIndex = getStartIndex();
  const visibleIndices = Array.from(
    { length: visibleButtons },
    (_, i) => startIndex + i
  );

  return (
    <div className="flex gap-3 px-6 items-center h-18 w-full">
      <button
        onClick={() => scrollPrev()}
        className={cn(
          "flex items-center justify-center size-9 border-2 border-neutral-lighter text-neutral-lighter",
          !canScrollPrev && "opacity-50"
        )}
      >
        <Icon name="chevronLeft" size={24} />
      </button>
      {visibleIndices.map((index) => (
        <button
          onClick={() => api?.scrollTo(index)}
          key={index}
          className={cn(
            "flex items-center justify-center size-9 border-2 border-neutral-lighter text-neutral-lighter",
            currentSlide === index && "bg-ocean border-ocean"
          )}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => scrollNext()}
        className={cn(
          "flex items-center justify-center size-9 border-2 border-neutral-lighter text-neutral-lighter",
          !canScrollNext && "opacity-50"
        )}
      >
        <Icon name="chevronRight" size={24} />
      </button>
    </div>
  );
};

export function BeliefsCarouselMobile() {
  return (
    <div className="z-30">
      <img
        src="/assets/images/about/beliefs.webp"
        alt="Beliefs"
        className="w-full min-h-[220px] object-cover"
      />
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full relative mb-12"
        >
          <CarouselContent>
            {beliefsData.map((belief, _index) => (
              <CarouselItem
                key={belief.title}
                className={cn(
                  "pl-0",
                  "basis-[100%]",
                  "md:basis-[50%]",
                  "lg:basis-[33.333%]"
                )}
                data-belief-title={belief.title}
              >
                <div className={cn("px-6 py-12 bg-dark-navy h-full")}>
                  <h4 className="text-3xl text-background-secondary font-extrabold mb-4">
                    {belief.title}
                  </h4>
                  <p className="text-lg text-ocean">{belief.verses}</p>
                  {belief.description && (
                    <p className="text-background-secondary mt-4">
                      {belief.description}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <BeliefsMobilePagination />
        </Carousel>
      </div>
    </div>
  );
}
