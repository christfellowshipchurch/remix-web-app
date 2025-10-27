import { useEffect, useRef, useState } from "react";
import HTMLRenderer from "~/primitives/html-renderer";
import { chanceContent } from "./a-chance.data";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export function SnapScrollLayout() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(
    new Set()
  );
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute("data-card-index") || "0"
          );
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          } else {
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(index);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
        rootMargin: "0px 0px -10% 0px", // Start animation slightly before fully in view
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {chanceContent.map((section, index) => (
        <section
          key={section.title}
          ref={(el) => (sectionRefs.current[index] = el)}
          className="relative flex items-center p-12 snap-center min-h-screen w-full"
          data-card-title={section.title}
          data-card-index={index}
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-4xl mx-auto">
            <img
              src={section.image}
              alt={section.title}
              className="md:w-1/2 max-w-sm lg:max-w-none w-full -z-30"
            />
            <div
              className={`md:w-1/2 max-w-sm lg:max-w-none md:ml-auto flex flex-col gap-9 transition-all duration-1000 ease-out delay-300 -z-30 ${
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
    </>
  );
}
