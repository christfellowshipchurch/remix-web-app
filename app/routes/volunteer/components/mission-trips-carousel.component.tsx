import { useLayoutEffect, useRef, useState, useCallback } from "react";

import { Trip } from "../types";
import { MissionTripCard } from "./cards/mission-trip-card.component";
import {
  Carousel,
  CarouselArrows,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "~/primitives/shadcn-primitives/carousel";

const CARDS_PER_SLIDE = 3;

const carouselControlProps = {
  activeClassName: "bg-ocean" as const,
  inactiveClassName: "bg-white/30" as const,
  arrowStyles:
    "text-white border-white/40 hover:text-neutral-light hover:border-neutral-light bg-transparent transition-colors duration-300",
};

const MD_MAX = 767; // same as max-md in Tailwind

function chunkTrips(trips: Trip[], size: number): Trip[][] {
  const chunks: Trip[][] = [];
  for (let i = 0; i < trips.length; i += size) {
    chunks.push(trips.slice(i, i + size));
  }
  return chunks;
}

/**
 * Embla + flex do not always give a definite cross-size for `h-full` / `min-h-full` on
 * every slide, so we equalize with the max measured slide height (ResizeObserver + images).
 */
function MobileMultiTripsCarousel({ trips }: { trips: Trip[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [minSlideH, setMinSlideH] = useState<number | null>(null);

  const sync = useCallback(() => {
    const root = rootRef.current;
    if (typeof window === "undefined" || !root) return;

    if (window.innerWidth > MD_MAX) {
      setMinSlideH(null);
      return;
    }

    const nodes = root.querySelectorAll<HTMLElement>("[data-mission-slide]");
    if (nodes.length === 0) return;

    const maxH = Array.from(nodes).reduce(
      (m, el) => Math.max(m, el.getBoundingClientRect().height),
      0,
    );

    if (maxH > 0) {
      setMinSlideH((prev) =>
        prev !== null && Math.abs(prev - maxH) < 0.5 ? prev : Math.ceil(maxH),
      );
    }
  }, []);

  useLayoutEffect(() => {
    sync();
    const root = rootRef.current;
    if (!root) return;

    const onResize = () => {
      if (window.innerWidth > MD_MAX) {
        setMinSlideH(null);
        return;
      }
      window.requestAnimationFrame(() => {
        void sync();
      });
    };

    const ro = new ResizeObserver(() => onResize());
    ro.observe(root);

    const mql = window.matchMedia(`(max-width: ${MD_MAX}px)`);
    mql.addEventListener("change", onResize);
    window.addEventListener("resize", onResize);

    const imgs = root.querySelectorAll("img");
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", onResize);
    });

    return () => {
      ro.disconnect();
      mql.removeEventListener("change", onResize);
      window.removeEventListener("resize", onResize);
      imgs.forEach((img) => img.removeEventListener("load", onResize));
    };
  }, [sync, trips]);

  return (
    <div ref={rootRef} className="w-full">
      <Carousel
        opts={{ align: "start", containScroll: "trimSnaps" }}
        className="w-full"
      >
        <CarouselContent className="items-stretch! pr-5">
          {trips.map((trip) => (
            <CarouselItem
              key={trip.id}
              data-mission-slide
              className="flex w-[60vw] max-w-[258px] min-w-0 min-h-0 basis-[60vw] flex-col pl-5 self-stretch"
              style={minSlideH ? { minHeight: minSlideH } : undefined}
            >
              <MissionTripCard
                trip={trip}
                className="h-full w-full min-h-0 min-w-0 max-w-full"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex items-center justify-between px-5">
          <CarouselDots
            activeClassName={carouselControlProps.activeClassName}
            inactiveClassName={carouselControlProps.inactiveClassName}
            className="justify-start gap-2"
          />
          <CarouselArrows arrowStyles={carouselControlProps.arrowStyles} />
        </div>
      </Carousel>
    </div>
  );
}

export function MissionTripsCarousel({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile: one card per slide, horizontal scroll — full-bleed (negates section .content-padding) */}
      <div className="w-[calc(100%+2.5rem)] -mx-5 md:hidden">
        {trips.length === 1 ? (
          <div className="px-5">
            <MissionTripCard trip={trips[0]!} />
          </div>
        ) : (
          <MobileMultiTripsCarousel trips={trips} />
        )}
      </div>

      {/* md+: vertical stack of up to 3 per page, horizontal pagination when needed */}
      <div className="hidden md:block">
        {trips.length <= CARDS_PER_SLIDE ? (
          <div className="flex flex-col gap-4">
            {trips.map((trip) => (
              <MissionTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <ChunkCarousel trips={trips} />
        )}
      </div>
    </>
  );
}

function ChunkCarousel({ trips }: { trips: Trip[] }) {
  const chunks = chunkTrips(trips, CARDS_PER_SLIDE);

  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {chunks.map((chunk, i) => (
          <CarouselItem key={i} className="basis-full">
            <div className="flex flex-col gap-4">
              {chunk.map((trip) => (
                <MissionTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="mt-6 flex items-center justify-between px-1">
        <CarouselDots
          activeClassName={carouselControlProps.activeClassName}
          inactiveClassName={carouselControlProps.inactiveClassName}
          className="justify-start gap-2"
        />
        <CarouselArrows arrowStyles={carouselControlProps.arrowStyles} />
      </div>
    </Carousel>
  );
}
