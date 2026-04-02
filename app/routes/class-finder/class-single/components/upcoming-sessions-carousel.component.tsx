import { useMemo } from "react";

import { cn } from "~/lib/utils";
import { Button } from "~/primitives/shadcn-primitives/button";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  useCarousel,
} from "~/primitives/shadcn-primitives/carousel";
import Icon from "~/primitives/icon";
import type { ClassHitType } from "../../../types";
import { UpcomingSessionCard } from "./upcoming-session-card.component";

export const UPCOMING_SESSIONS_CAROUSEL_CARDS_PER_SLIDE = 4;

function UpcomingCarouselNavRow() {
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

export function UpcomingSessionsCarousel({
  hits,
  resetKey,
}: {
  hits: ClassHitType[];
  resetKey: string;
}) {
  const slides = useMemo(() => {
    const n = UPCOMING_SESSIONS_CAROUSEL_CARDS_PER_SLIDE;
    const out: ClassHitType[][] = [];
    for (let i = 0; i < hits.length; i += n) {
      out.push(hits.slice(i, i + n));
    }
    return out;
  }, [hits]);

  if (hits.length === 0) {
    return null;
  }

  return (
    <Carousel
      key={resetKey}
      opts={{ align: "start", containScroll: "trimSnaps" }}
      className="w-full max-w-[1296px]"
    >
      <CarouselContent className="-ml-0">
        {slides.map((chunk, slideIndex) => (
          <CarouselItem key={slideIndex} className="basis-full pl-0">
            <div className="grid w-full grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {chunk.map((hit) => (
                <div
                  key={hit.objectID}
                  className="flex w-full justify-center sm:justify-start"
                >
                  <UpcomingSessionCard hit={hit} />
                </div>
              ))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <UpcomingCarouselNavRow />
    </Carousel>
  );
}
