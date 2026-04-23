import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import {
  volunteerTestimonialsData,
  type VolunteerTestimonialCardType,
} from "../volunteer-testimonials.data";

export type { VolunteerTestimonialCardType };

const SWIPE_MIN_PX = 56;
const MOBILE_BORDER = "#BFC8CC";
/** Gap between desktop slides (matches `gap-4`). */
const DESKTOP_SLIDE_GAP_PX = 16;
/** Main card width; capped by viewport so the next slide fills the remaining visible width. */
const DESKTOP_MAIN_CARD_MAX_PX = 1072;

export function VolunteerTestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeStartRef = useRef<{
    x: number;
    y: number;
    pointerId: number;
  } | null>(null);
  const slideCount = volunteerTestimonialsData.length;
  const lastIndex = slideCount - 1;

  const clearSwipeTracking = useCallback(
    (el: HTMLDivElement | null, pointerId: number) => {
      swipeStartRef.current = null;
      if (!el) return;
      try {
        if (el.hasPointerCapture(pointerId)) {
          el.releasePointerCapture(pointerId);
        }
      } catch {
        /* releasePointerCapture can throw if already released */
      }
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("button, a")) return;

      swipeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        pointerId: e.pointerId,
      };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* setPointerCapture unsupported or failed */
      }
    },
    [],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = swipeStartRef.current;
      if (!start || start.pointerId !== e.pointerId) return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      clearSwipeTracking(e.currentTarget, e.pointerId);

      if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.15) {
        return;
      }

      if (dx < 0) {
        setActiveIndex((i) => Math.min(lastIndex, i + 1));
      } else {
        setActiveIndex((i) => Math.max(0, i - 1));
      }
    },
    [clearSwipeTracking, lastIndex],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (swipeStartRef.current?.pointerId !== e.pointerId) return;
      clearSwipeTracking(e.currentTarget, e.pointerId);
    },
    [clearSwipeTracking],
  );

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(lastIndex, i + 1));

  const desktopViewportRef = useRef<HTMLDivElement>(null);
  const [desktopViewportWidth, setDesktopViewportWidth] = useState(0);

  useLayoutEffect(() => {
    const el = desktopViewportRef.current;
    if (!el) return;

    const measure = () => {
      setDesktopViewportWidth(el.clientWidth);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const desktopSlideWidthPx =
    desktopViewportWidth > 0
      ? Math.min(DESKTOP_MAIN_CARD_MAX_PX, Math.round(desktopViewportWidth))
      : DESKTOP_MAIN_CARD_MAX_PX;
  const desktopStepPx = desktopSlideWidthPx + DESKTOP_SLIDE_GAP_PX;

  return (
    <div
      className="flex w-full flex-col items-center gap-6 md:gap-8"
      role="region"
      aria-roledescription="carousel"
      aria-label="Volunteer testimonial stories"
    >
      <div
        className="flex w-full justify-center [touch-action:pan-y]"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          ref={desktopViewportRef}
          className="mx-auto hidden w-full max-w-content cursor-grab select-none overflow-hidden py-2 active:cursor-grabbing lg:block"
        >
          <div
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${activeIndex * desktopStepPx}px)`,
            }}
          >
            {volunteerTestimonialsData.map((item, index) => (
              <div
                key={`desktop-slide-${index}`}
                className="min-w-0 shrink-0"
                style={{ width: desktopSlideWidthPx }}
                aria-hidden={index !== activeIndex}
                inert={index !== activeIndex}
              >
                <TestimonialDesktopCard data={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full justify-center lg:hidden">
          <TestimonialMobileCard
            key={activeIndex}
            data={volunteerTestimonialsData[activeIndex]}
            onPrev={goPrev}
            onNext={goNext}
            canGoPrev={activeIndex > 0}
            canGoNext={activeIndex < lastIndex}
          />
        </div>
      </div>

      <nav
        className="hidden items-center justify-center gap-2 lg:flex"
        aria-label="Choose testimonial"
      >
        {volunteerTestimonialsData.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show testimonial ${index + 1} of ${slideCount}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "h-2 shrink-0 cursor-pointer rounded-full transition-[width,background-color] duration-300 ease-out",
                isActive
                  ? "w-8 bg-ocean"
                  : "w-2 bg-neutral-lighter hover:bg-ocean/35",
              )}
            />
          );
        })}
      </nav>
    </div>
  );
}

const TestimonialDesktopCard = ({
  data,
}: {
  data: VolunteerTestimonialCardType;
}) => {
  const { heading, title, description, desktopImage } = data;

  return (
    <div className="flex w-full select-none items-stretch overflow-hidden rounded-[24px] bg-white p-4 shadow-sm">
      <div className="relative w-full max-w-[400px] shrink-0 self-start overflow-hidden rounded-2xl">
        <img
          src={desktopImage}
          alt={heading}
          draggable={false}
          className="block h-auto w-full max-w-full align-top"
        />
        <div className="pointer-events-none absolute left-0 top-1 z-2 max-w-[min(100%-3rem,20rem)]">
          <div className="flex items-center gap-2 rounded-[10px] bg-ocean px-4 py-2 text-white">
            <span
              className="size-2 shrink-0 rounded-full bg-white"
              aria-hidden
            />
            <p className="line-clamp-2 text-lg font-medium">{title}</p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-8 px-8 py-10 xl:px-12 xl:py-14">
        <h3 className="text-2xl font-extrabold leading-tight text-navy xl:text-3xl">
          {heading}
        </h3>
        <p className="text-text-secondary">{description}</p>
      </div>
    </div>
  );
};

const TestimonialMobileCard = ({
  data,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: {
  data: VolunteerTestimonialCardType;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}) => {
  const { heading, mobileImage, longDescription, description } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  const fullStory = longDescription ?? description;

  const arrowBtnClass = cn(
    "flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-ocean text-ocean transition-colors",
    "enabled:hover:bg-ocean/10",
    "disabled:pointer-events-none disabled:border-gray disabled:text-gray disabled:opacity-50",
  );

  return (
    <article className="w-full max-w-[480px] overflow-hidden">
      <div className="overflow-hidden rounded-[36px]">
        <img
          src={mobileImage}
          alt={heading}
          className="aspect-4/3 w-full object-cover"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <h3 className="text-xl font-extrabold leading-tight text-navy">
          {heading}
        </h3>
        <p
          className={cn(
            "text-base leading-relaxed text-text-secondary",
            !isExpanded && "line-clamp-3",
          )}
        >
          {fullStory}
        </p>

        <div className="flex min-w-0 items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="flex min-w-0 items-center gap-2 text-left font-bold text-navy transition-opacity hover:opacity-80"
            aria-expanded={isExpanded}
          >
            <span className="shrink-0">Read Full Story</span>
            <Icon
              name="chevronDown"
              size={20}
              className={cn(
                "shrink-0 transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          </button>

          <div
            className="flex shrink-0 items-center gap-2"
            aria-label="Previous or next testimonial"
          >
            <button
              type="button"
              onClick={onPrev}
              disabled={!canGoPrev}
              aria-label="Previous testimonial"
              className={arrowBtnClass}
            >
              <Icon name="chevronLeft" size={20} />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canGoNext}
              aria-label="Next testimonial"
              className={arrowBtnClass}
            >
              <Icon name="chevronRight" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-5 border-b"
        style={{ borderColor: MOBILE_BORDER }}
        aria-hidden
      />
    </article>
  );
};
