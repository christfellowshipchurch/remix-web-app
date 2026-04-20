import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "~/lib/utils";
import Icon from "~/primitives/icon";

import {
  VolunteerAtChurchCard,
  VolunteerAtChurchCardProps,
} from "./cards/volunteer-at-church-card.component";

// gap-3 = 12px
const GAP = 12;

// Right-breathing-room baked into each breakpoint's width calc so the last
// visible card is never flush against the viewport edge.
//   sm:  (100% - 1 gap - 24px margin) / 2 visible cards
//   lg:  (100% - 2 gaps - 40px margin) / 3 visible cards
const SLIDE_CLASS =
  "snap-start shrink-0 w-[82%] sm:w-[calc((100%-36px)/2)] lg:w-[calc((100%-64px)/3)] max-w-[405px]";

const volunteerAtChurchResources: VolunteerAtChurchCardProps[] = [
  {
    name: "Welcome & Experience",
    description:
      "Welcome guests, serve coffee, or help behind the scenes. Be part of making church feel easy to walk into.",
    tag: "Front-Facing",
    imageId: 3162785,
    pathname: "/volunteer/welcome-experience",
  },
  {
    name: "Groups & Classes",
    description:
      "Lead a group or class and help people grow through conversation and community. You don't have to have it all figured out—we'll guide you.",
    tag: "Lead & Guide",
    imageId: 3162858,
    pathname: "/volunteer/groups-classes",
  },
  {
    name: "Creative & Production",
    description:
      "Help with music, visuals, photo, video, or production during services. No experience needed—we'll help you get started.",
    tag: "Creative & Tech",
    imageId: 3162876,
    pathname: "/volunteer/creative-production",
  },
  {
    name: "Care & Prayer",
    description:
      "Support people through prayer, care groups, or recovery ministries. Great if you're a good listener and want to be there for others.",
    tag: "Listen & Support",
    imageId: 3160918,
    pathname: "/volunteer/care-prayer",
  },
  {
    name: "Operations & Support",
    description:
      "Help with events, setup, admin, or support roles across the church. Great if you like staying organized and jumping in where needed.",
    tag: "Behind the Scenes",
    imageId: 3162878,
    pathname: "/volunteer/operations-support",
  },
  {
    name: "Family Ministry & Next Gen",
    description:
      "Spend time with kids, students, or young adults and help them grow. Great if you enjoy building relationships and encouraging others.",
    tag: "Mentor & Encourage",
    imageId: 3162915,
    pathname: "/volunteer/family-ministry-next-gen",
  },
  {
    name: "Outreach & Missions",
    description:
      "Serve in ministries like prison outreach, foster care, or special needs support. Great if you want to build relationships and show up consistently.",
    tag: "Step Into Real Needs",
    imageId: 3162916,
    pathname: "/volunteer/outreach-missions",
  },
];

export function VolunteerAtChurchCarousel() {
  const resources = volunteerAtChurchResources;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Number of reachable scroll positions = total cards − (visible cards − 1)
  const pageCount = Math.max(1, resources.length - visibleCount + 1);

  const getSlides = (el: HTMLDivElement) =>
    Array.from(el.querySelectorAll<HTMLElement>('[role="group"]'));

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);

    const slides = getSlides(el);
    if (!slides.length) return;

    // Visible count: how many full card-widths fit in the track
    const cardWidth = slides[0].offsetWidth;
    const count = Math.max(1, Math.round(clientWidth / (cardWidth + GAP)));
    setVisibleCount(count);

    // Active index: slide whose left edge is closest to scrollLeft
    let closest = 0;
    let minDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = getSlides(el)[index];
    if (slide) el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  };

  // Prev/Next step by 1 card; next is capped so the last position always shows
  // a full set of visible cards (no empty slots at the end).
  const handlePrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const handleNext = () =>
    scrollToIndex(Math.min(resources.length - visibleCount, activeIndex + 1));

  return (
    <div
      className="w-full text-text-primary"
      role="region"
      aria-roledescription="carousel"
      aria-label="Volunteer at church"
    >
      <div
        ref={trackRef}
        className="flex gap-8 pt-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {resources.map((resource, index) => (
          <div
            key={resource.pathname}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${resources.length}`}
            className={SLIDE_CLASS}
          >
            <VolunteerAtChurchCard resource={resource} />
          </div>
        ))}
      </div>

      {/* Dots + arrows */}
      <div className="relative mt-8 w-full min-h-[4.5rem] pb-14 sm:mt-12 sm:pb-16 md:mt-16 md:min-h-0 md:pb-8">
        <div className="absolute top-1 left-0 flex h-12 items-center gap-2 md:top-7">
          {Array.from({ length: pageCount }, (_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={isActive}
                className={cn(
                  "h-2 w-2 cursor-pointer rounded-full transition-colors",
                  isActive ? "bg-white" : "bg-white/35 hover:bg-white/60",
                )}
              />
            );
          })}
        </div>

        <div className="absolute top-1 right-4 flex h-12 items-center justify-end gap-3 sm:right-8 md:top-7 lg:right-4 ">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Previous slide"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white text-white transition-colors hover:text-neutral-light hover:border-neutral-light disabled:cursor-not-allowed disabled:border-gray disabled:opacity-60"
          >
            <Icon name="chevronLeft" size={20} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Next slide"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white text-white transition-colors hover:text-neutral-light hover:border-neutral-light disabled:cursor-not-allowed disabled:border-gray disabled:opacity-60"
          >
            <Icon name="chevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
