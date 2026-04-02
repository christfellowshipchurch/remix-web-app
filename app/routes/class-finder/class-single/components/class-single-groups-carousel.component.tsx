import { useMemo } from "react";

import { cn } from "~/lib/utils";
import {
  CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_CONTENT_GAP_CLASS,
  CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_ITEM_CLASS,
  classSingleCarouselSlideGridColsClass,
  useClassSingleCarouselCardsPerSlide,
} from "../hooks/use-class-single-carousel-cards-per-slide";
import { Button } from "~/primitives/shadcn-primitives/button";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  useCarousel,
} from "~/primitives/shadcn-primitives/carousel";
import Icon from "~/primitives/icon";
import { GroupHit } from "~/routes/group-finder/components/group-hit.component";
import type { GroupType } from "~/routes/group-finder/types";

function ClassSingleGroupsCarouselNavRow() {
  const { api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();
  const slideCount = api?.scrollSnapList().length ?? 0;
  if (slideCount <= 1) return null;

  return (
    <div className="mt-6 flex w-full flex-row items-center justify-between gap-4 px-1">
      <CarouselDots
        className="justify-start gap-2"
        activeClassName="h-2 w-2 bg-ocean"
        inactiveClassName="h-2 w-2 bg-neutral-lighter"
      />
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!canScrollPrev}
          className={cn(
            "size-12 rounded-full border-ocean text-ocean",
            "hover:border-navy hover:text-navy",
            "disabled:border-[#AAAAAA] disabled:text-[#AAAAAA]",
          )}
          aria-label="Previous slide"
          onClick={scrollPrev}
        >
          <Icon name="arrowBack" className="size-6" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!canScrollNext}
          className={cn(
            "size-12 rounded-full border-ocean text-ocean",
            "hover:border-navy hover:text-navy",
            "disabled:border-[#AAAAAA] disabled:text-[#AAAAAA]",
          )}
          aria-label="Next slide"
          onClick={scrollNext}
        >
          <Icon name="arrowRight" className="size-6" />
        </Button>
      </div>
    </div>
  );
}

export function ClassSingleGroupsCarousel({
  hits,
  resetKey,
  backUrl,
}: {
  hits: GroupType[];
  resetKey: string;
  backUrl: string;
}) {
  const cardsPerSlide = useClassSingleCarouselCardsPerSlide();

  const slides = useMemo(() => {
    const n = cardsPerSlide;
    const out: GroupType[][] = [];
    for (let i = 0; i < hits.length; i += n) {
      out.push(hits.slice(i, i + n));
    }
    return out;
  }, [hits, cardsPerSlide]);

  if (hits.length === 0) {
    return null;
  }

  return (
    <Carousel
      key={`${resetKey}-${cardsPerSlide}`}
      opts={{ align: "start", containScroll: "trimSnaps" }}
      className="w-full max-w-[1296px]"
    >
      <CarouselContent
        className={cn(
          "ml-0 py-1.5",
          cardsPerSlide === 1 && CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_CONTENT_GAP_CLASS,
        )}
      >
        {cardsPerSlide === 1
          ? hits.map((hit) => (
              <CarouselItem
                key={hit.objectID}
                className={CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_ITEM_CLASS}
              >
                <div className="flex h-full min-h-0 w-full justify-center">
                  <GroupHit hit={hit} backUrl={backUrl} />
                </div>
              </CarouselItem>
            ))
          : slides.map((chunk, slideIndex) => (
              <CarouselItem key={slideIndex} className="basis-full pl-0">
                <div
                  className={cn(
                    "grid w-full items-stretch gap-x-4 gap-y-6 xl:gap-x-8",
                    classSingleCarouselSlideGridColsClass(cardsPerSlide),
                  )}
                >
                  {chunk.map((hit) => (
                    <div
                      key={hit.objectID}
                      className="flex h-full min-h-0 w-full justify-center sm:justify-start"
                    >
                      <GroupHit hit={hit} backUrl={backUrl} />
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
      </CarouselContent>
      <ClassSingleGroupsCarouselNavRow />
    </Carousel>
  );
}
