import { useRef, useState, useEffect } from "react";
import HTMLRenderer from "~/primitives/html-renderer";
import { chanceContent } from "./a-chance.data";
import { cn } from "~/lib/utils";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export default function SplitScrollLayout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const FADE_DURATION = 500; // ms

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -60% 0px", // triggers when section is 40% from top
      threshold: 0.1,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // Find the entry that is most visible and update activeIndex
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length > 0) {
        const index = sectionRefs.current.findIndex(
          (ref) => ref === visibleEntries[0].target
        );
        if (index !== -1) setActiveIndex(index);
      }
    };

    const observer = new window.IntersectionObserver(
      handleIntersect,
      observerOptions
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Fade-out, then update image, then fade-in
  useEffect(() => {
    if (activeIndex === displayedIndex) return;
    setFade(true);
    const timeout = setTimeout(() => {
      setDisplayedIndex(activeIndex);
      setFade(false);
    }, FADE_DURATION);
    return () => clearTimeout(timeout);
  }, [activeIndex, displayedIndex]);

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden no-scrollbar pt-20 flex flex-col gap-20">
        {chanceContent.map((section, index) => (
          <div
            key={section.title}
            className="flex flex-col items-center p-6 max-w-sm mx-auto"
            data-card-title={section.title}
            data-card-index={index}
          >
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-64 object-cover rounded mb-6"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-normal text-center leading-none">
                <HTMLRenderer html={section.title} />
              </h2>
              <p className="text-gray-600 font-medium text-sm text-center">
                {section.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout */}

      {/* Sticky Left Image */}
      <div
        className={cn(
          "hidden md:flex items-center justify-center",
          "w-1/2 absolute top-0 h-screen",
          "z-[-1] bg-white"
        )}
      >
        <img
          src={chanceContent[displayedIndex].image}
          alt={chanceContent[displayedIndex].title}
          className={cn(
            "object-cover px-6 max-w-sm lg:max-w-md xl:max-w-lg transition-all duration-500",
            fade ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
        />
      </div>

      <div className="hidden md:flex min-h-screen max-w-screen-content mx-auto">
        {/* Left/Sticky image here if needed */}
        <div className="w-full overflow-y-auto snap-y snap-mandatory scroll-smooth h-screen no-scrollbar">
          {chanceContent.map((section, index) => (
            <div
              key={section.title}
              ref={(el) => (sectionRefs.current[index] = el)}
              className="flex items-center p-12 snap-center h-screen"
              data-card-title={section.title}
              data-card-index={index}
            >
              <div className="w-1/2 max-w-xl ml-auto flex flex-col gap-9">
                <div className="flex flex-col">
                  <h2 className="text-3xl font-normal text-pretty">
                    <HTMLRenderer html={section.title} />
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-pretty">
                    {section.description}
                  </p>
                </div>
                <IconButton
                  className="rounded-[400px] hover:!text-ocean"
                  withRotatingArrow
                  iconClasses="!bg-navy"
                  to={section.url}
                >
                  Learn More
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
