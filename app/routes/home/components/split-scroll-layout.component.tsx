import { useRef, useState, useEffect } from "react";
import HTMLRenderer from "~/primitives/html-renderer";
import { chanceContent } from "./a-chance.data";
import { cn } from "~/lib/utils";

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
      <div className="md:hidden no-scrollbar">
        {chanceContent.map((section) => (
          <div
            key={section.title}
            className="h-[60dvh] flex flex-col items-center p-6"
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
          "w-1/2 absolute top-0 h-screen",
          "hidden md:flex items-center justify-center",
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

      <div className="hidden md:flex min-h-screen">
        {/* Left/Sticky image here if needed */}
        <div className="w-full overflow-y-auto snap-y snap-mandatory scroll-smooth h-screen no-scrollbar">
          {chanceContent.map((section, index) => (
            <div
              key={section.title}
              ref={(el) => (sectionRefs.current[index] = el)}
              className="flex items-center p-12 snap-center h-screen"
            >
              <div className="w-1/2 ml-auto">
                <h2 className="text-3xl font-normal text-pretty">
                  <HTMLRenderer html={section.title} />
                </h2>
                <p className="text-gray-600 leading-relaxed text-pretty">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
