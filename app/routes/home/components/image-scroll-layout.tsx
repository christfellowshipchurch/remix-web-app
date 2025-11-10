import { useEffect, useRef, useState } from "react";
import HTMLRenderer from "~/primitives/html-renderer";
import { chanceContent } from "./a-chance.data";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export function ImageScrollLayout() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(
    new Set()
  );
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const intersectionRatios = useRef<Map<number, number>>(new Map());
  const activeSectionRef = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute("data-card-index") || "0"
          );
          const intersectionRatio = entry.intersectionRatio;

          // Store intersection ratios for all sections
          intersectionRatios.current.set(index, intersectionRatio);

          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        });

        // Find the section with the highest intersection ratio
        // Only update if it's significantly higher (hysteresis to prevent flickering)
        let maxIntersection = 0;
        let mostVisibleIndex = activeSectionRef.current;

        intersectionRatios.current.forEach((ratio, index) => {
          if (ratio > maxIntersection) {
            maxIntersection = ratio;
            mostVisibleIndex = index;
          }
        });

        // Only update if:
        // 1. The new section has at least 30% visibility
        // 2. It's at least 10% more visible than the current active section
        const currentRatio =
          intersectionRatios.current.get(activeSectionRef.current) || 0;
        const shouldSwitch =
          maxIntersection >= 0.3 &&
          mostVisibleIndex !== activeSectionRef.current &&
          maxIntersection >= currentRatio + 0.1;

        if (shouldSwitch) {
          activeSectionRef.current = mostVisibleIndex;
          setActiveSection(mostVisibleIndex);
        }
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "0px",
      }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative pt-48">
      <div className="absolute top-0 left-0 w-screen h-1/8 bg-gradient-to-b from-white to-transparent z-10" />
      {/* Fixed Image Container */}
      <div className="hidden md:block fixed left-0 top-0 w-1/2 h-screen -z-10">
        <div className="sticky top-0 w-full h-screen flex items-center justify-center p-12">
          <div className="relative w-full max-w-xl mx-auto aspect-square">
            {chanceContent.map((section, index) => (
              <img
                key={section.image}
                src={section.image}
                alt={section.title}
                className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ${
                  index === activeSection
                    ? "opacity-100 translate-x-0 z-10"
                    : "opacity-0 -translate-x-8 z-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content Sections */}
      <div className="md:ml-[50%]">
        {chanceContent.map((section, index) => (
          <section
            key={section.title}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="relative flex items-center p-12 min-h-screen w-full"
            data-card-index={index}
          >
            <div className="flex flex-col justify-center items-center gap-12 max-w-2xl mx-auto w-full">
              {/* Mobile Image */}
              <img
                src={section.image}
                alt={section.title}
                className="md:hidden w-full max-w-sm -z-30"
              />
              <div
                className={`w-full flex flex-col gap-9 transition-all duration-1000 ease-out delay-300 ${
                  visibleSections.has(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
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
          </section>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-screen h-1/8 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
