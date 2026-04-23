import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Video } from "~/primitives/video/video.primitive";

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
          className="mx-auto hidden w-full max-w-content cursor-grab overflow-hidden py-2 active:cursor-grabbing lg:block"
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
  const { heading, title, description, desktopImage, video } = data;
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handlePauseClick = () => {
    setIsPlaying(false);
  };

  if (isPlaying && video) {
    return (
      <div className="relative w-full min-h-[560px] overflow-hidden rounded-[24px]">
        <Video wistiaId={video} controls className="size-full min-h-[560px]" />
        <button
          type="button"
          className="absolute left-5 top-5 cursor-pointer rounded-full bg-[#3D3D3D]/50 p-2 transition-colors hover:bg-[#3D3D3D]/70"
          onClick={handlePauseClick}
          aria-label="Close video"
        >
          <Icon name="arrowBack" color="white" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-[560px] overflow-hidden rounded-[24px] bg-white p-4 shadow-sm">
      <div className="relative min-h-[560px] min-w-0 flex-1 basis-1/2">
        <img
          src={desktopImage}
          alt={heading}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="pointer-events-none absolute left-6 top-6 z-2 max-w-[min(100%-3rem,20rem)]">
          <div className="flex items-center gap-2 rounded-full bg-ocean px-4 py-2 text-white">
            <span
              className="size-2 shrink-0 rounded-full bg-white"
              aria-hidden
            />
            <p className="line-clamp-2 text-sm font-medium leading-tight">
              {title}
            </p>
          </div>
        </div>
        {video ? (
          <button
            type="button"
            className="group absolute inset-0 z-1 cursor-pointer"
            onClick={handlePlayClick}
            aria-label="Play video"
          >
            <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            <span className="absolute bottom-5 right-5 rounded-full bg-[#3D3D3D]/50 p-3 transition-colors hover:bg-[#3D3D3D]/70">
              <span className="relative -right-[2px] block size-10 xl:size-16">
                <Icon
                  name="play"
                  color="white"
                  className="size-10 xl:size-16"
                />
              </span>
            </span>
          </button>
        ) : null}
      </div>

      <div className="flex min-h-[560px] min-w-0 flex-1 basis-1/2 flex-col justify-center gap-8 px-8 py-10 xl:px-12 xl:py-14">
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

export type VolunteerTestimonialCardType = {
  heading: string;
  title: string;
  description: string;
  /** Shown on desktop body; can differ from mobile story */
  shortContent: string;
  desktopImage: string;
  mobileImage: string;
  /** Full copy for mobile “Read full story”; falls back to `description` if omitted */
  longDescription?: string;
  video?: string;
};

const volunteerTestimonialsData: VolunteerTestimonialCardType[] = [
  {
    title: "Donnie & Maria",
    description:
      "We never imagined serving could feel this natural. The team made it easy to find our place.",
    longDescription:
      "We never imagined serving could feel this natural. The team made it easy to find our place. Week after week we get to welcome people the way someone once welcomed us—and that never gets old. If you’re on the fence, take one step. You won’t regret it.",
    shortContent: "Welcome team",
    heading: "Sunday mornings changed our whole rhythm",
    desktopImage:
      "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
    mobileImage:
      "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
  },
  {
    title: "What is a Sunday Like 1",
    description: "What is a Sunday Like 1",
    longDescription:
      "What is a Sunday Like 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    shortContent: "What is a Sunday Like 1",
    heading: "What is a Sunday Like 1",
    desktopImage:
      "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
    mobileImage:
      "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
  },
  {
    title: "What is a Sunday Like 1",
    description: "What is a Sunday Like 1",
    longDescription:
      "What is a Sunday Like 1. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    shortContent: "What is a Sunday Like 1",
    heading: "What is a Sunday Like 1",
    desktopImage:
      "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
    mobileImage:
      "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
  },
];
