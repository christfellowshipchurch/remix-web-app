import { cn, getImageUrl } from "~/lib/utils";
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
      <div className="relative aspect-video w-full overflow-hidden rounded-[24px]">
        <Video wistiaId={video} controls className="size-full" />
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
        {/* {video ? (
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
        ) : null} */}
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
    title: "Tad & Ashley",
    heading: "It’s Not About Buildings, It’s About Belonging.",
    description:
      "Tad and Ashley had everything lined up— careers, a home, two kids, and a steady rhythm of life. But they knew something was missing.",
    shortContent: `\u201cThey\u2019re Growing Up Knowing God Is Always With Them\u201d`,
    longDescription: `Tad and Ashley had everything lined up\u2014 careers, a home, two kids, and a steady rhythm of life. But they knew something was missing. When they moved to Westlake, a simple invite from their neighbors became the thread God used to draw them to church. Sundays at Christ Fellowship soon became non-negotiable, they started reading the Bible, and joined a small group. With an education and career in Aerospace Engineering, Tad had plenty of questions about faith. \u201cBut everyone gave me permission to go on my own journey at my own pace,\u201d he said. Neither Tad nor Ashley grew up in church, but their kids began praying for family members before bed and asking big questions about God. Even when they didn\u2019t have the answers, the family learned together\u2014discovering forgiveness, peace, and grace. \u201cThey\u2019re growing up knowing God is always with them,\u201d Ashley said, \u201cand they\u2019ll carry a strength we never had.\u201d Eventually, Tad and Ashley couldn\u2019t wait any longer to declare their faith. They invited close friends and neighbors to their home, where Pastor Jonathan baptized them in their backyard pool. Today, Tad serves on the worship team with his brother, Ashley serves in Christ Fellowship Kids, and together they gather friends and family to join them on Sundays. Expansion isn\u2019t about buildings\u2014it\u2019s about creating places where people like Tad and Ashley can encounter Jesus, discover purpose, and finally experience the \u201cmore\u201d to life their souls were searching for.`,
    desktopImage: "/images/stories/tad-ashley-wiggly.png",
    mobileImage: "/images/stories/tad-ashley-square.png",
    video: "umnkjcziny",
  },
  {
    title: "Addi’s Story",
    heading: "A Place Of Belonging",
    description:
      "After a lonely start to her college experience, Addi’s path began to change when someone suggested Southeastern University at Christ Fellowship (CFSEU).",
    shortContent:
      "\u201cI Got To Learn And Grow With Real-life Experience.\u201d",
    longDescription:
      "After a lonely start to her college experience, Addi’s path began to change when someone suggested Southeastern University at Christ Fellowship (CFSEU). When Addi learned that her brother had visited Christ Fellowship, it was another nudge of confirmation that CFSEU was where she was supposed to be. Addi transferred, and it didn’t take long for her to find a place of belonging. She dove into College Nights, Young Adults, CFStudents, and Celebrate Recovery, building meaningful connections along the way. Surrounded by supportive leaders, professors, and peers, Addi’s faith grew stronger, and her passion for pursuing God through her education deepened. She graduated in 2025 with her degree in pastoral care and counseling—her loneliness replaced with lasting community and lifelong friendships.",
    desktopImage: "/images/stories/addi-wiggly.png",
    mobileImage: "/images/stories/addi-square.png",
    video: "jhu7cckg3i",
  },
  {
    title: "Markaveus’ Story",
    heading: "When Jesus Steps In, Freedom Begins",
    description:
      "As Markaveus’ mom watched her son fall into a life of violence, gangs, and drugs, she prayed diligently that he would remember the values she tried to instill in him.",
    shortContent: "\u201cI Walked Out A Free Man In More Ways Than One.\u201d",
    longDescription:
      "As Markaveus’ mom watched her son fall into a life of violence, gangs, and drugs, she prayed diligently that he would remember the values she tried to instill in him. But it wasn’t long before Markaveus ended up in jail with felony charges, awaiting trial and the likelihood of a lengthy prison sentence. He was only in his early twenties, yet his future looked bleak. But what looked like a dead end became a U-turn in God’s hands as two men from Christ Fellowship, Ray and Jake, welcomed him into their Bible study. Every week for two years, they met with Markaveus in jail, discipling him and witnessing God transform his life. Before long, he was helping lead the Bible study, praying with others, and sharing his faith boldly with fellow inmates. Markaveus was released in the spring of 2025 and didn’t waste any time hopping on a bus to attend a Christ Fellowship service in person at the Port St. Lucie campus. When he found out baptisms were happening that day, he didn’t hesitate. He turned to Ray and said, \u201cFor the last couple of days, I’ve been praying for an opportunity to be baptized, and Jesus answered my prayer!\u201d God answered Markaveus’ prayer, and his mom’s prayers, too.",
    desktopImage: "/images/stories/markaveus-wiggly.png",
    mobileImage: "/images/stories/markaveus-square.png",
    video: "0flhlj0h1b",
  },
  {
    title: "Gerald’s Story",
    heading: "New Life",
    description:
      "Gerald grew up unsure if his life had value. But through Watoto, his story changed.",
    shortContent:
      "\u201cI Don\u2019t Fully Understand How Someone Can Love a Child They\u2019ve Never Met\u2014But Your Generosity Changed My Life.\u201d",
    longDescription:
      "Gerald grew up unsure if his life had value. But through Watoto, his story changed. Today, he leads as the President of the Music, Dance & Drama Club, using his voice and creativity to lift others. Gerald’s story is one of thousands. And the next 72 kids we sponsor? Their story starts now.",
    desktopImage: "/images/stories/gerald-wiggly.png",
    mobileImage: "/images/stories/gerald-square.png",
  },
  {
    title: "JJ’s Story",
    heading: "New Life",
    description:
      "JJ, a faithful and dedicated group leader in the Studio, has a heart for the next generation that’s unmatched.",
    shortContent:
      "\u201cA Heart for the Next Generation That\u2019s Unmatched.\u201d",
    longDescription:
      "JJ, a faithful and dedicated group leader in the Studio, has a heart for the next generation that’s unmatched. So much so that when one of the kids he leads wanted to get baptized, JJ returned home early from his family vacation so he could stand alongside the child in their milestone moment—talk about getting there first!",
    desktopImage: "/images/stories/jj-wiggly.png",
    mobileImage: "/images/stories/jj-square.png",
    video: "g360sjfvl0",
  },
  {
    title: "Ruth’s Story",
    heading: "The Message of Jesus",
    description:
      "How the Gospel Reached This 17-Year-Old From Liberia Who Grew Up in a Devout Muslim Home...",
    shortContent: "\u201cI Believe Jesus Is The Son Of God.\u201d",
    longDescription:
      "Ruth is a 17-year-old from Liberia who grew up in a devout Muslim home. When she joined a Beyond Success table, she was drawn to the values being taught, but hesitant about the message of Jesus. During a session called \u201cMy Most Important Relationship,\u201d Ruth quietly prayed to accept Christ. Though nervous to share her decision, she later told her facilitator, \u201cI believe Jesus is the Son of God.\u201d Her faith is now growing, and her heart is open to all God has for her.",
    desktopImage: "/images/stories/ruth-wiggly.png",
    mobileImage: "/images/stories/ruth-square.png",
  },
  {
    title: "Donnie & Maria",
    heading: "When The City Called, The Church Responded",
    description:
      "When Palm Beach Gardens Police and city officials discovered a local couple, Maria and Donnie, living in horrific conditions after their home was taken over by drug dealers, they didn’t know where to turn—so they called the church.",
    shortContent: "\u201cStunned And Grateful Beyond Words\u201d",
    longDescription:
      "When Palm Beach Gardens Police and city officials discovered a local couple, Maria and Donnie, living in horrific conditions after their home was taken over by drug dealers, they didn’t know where to turn—so they called the church. Within hours, Christ Fellowship volunteers and contractors rallied to gut the home, remove mold, and rebuild it into a safe, livable space. For the first time in years, Maria and Donnie felt truly loved and cared for. Fighting back tears, Donnie said he was \u201cstunned\u201d and grateful beyond words. This transformation happened because of the generosity of our church family—proving again that when the city calls, the Church shows up.",
    desktopImage: "/images/stories/donnie-maria-wiggly.png",
    mobileImage: "/images/stories/donnie-maria-square.png",
    video: "gxfxfzaviv",
  },
  {
    title: "Jennifer’s Story",
    heading: "Providing Hope, Safety, and the Love of Jesus",
    description:
      "After hearing the vision to Get There First for kids in foster care, Jennifer Huston—a single woman with a full-time job—felt God call her to say yes.",
    shortContent: "Providing Hope, Safety, and the Love of Jesus",
    longDescription:
      "After hearing the vision to Get There First for kids in foster care, Jennifer Huston—a single woman with a full-time job—felt God call her to say yes. Her first placement was a three-year-old boy with nowhere to go, followed by Mariah, a six-month-old in need of a safe, loving home. With support from Christ Fellowship, Jennifer’s yes gave both children hope, safety, and the love of Jesus—forever changing their stories.",
    desktopImage: getImageUrl("3163934"),
    mobileImage: getImageUrl("3163933"),
    video: "n5oc8odhj1",
  },
];
