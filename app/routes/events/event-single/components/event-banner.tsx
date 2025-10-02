import { useEffect, useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";

export const EventBanner = ({
  cta,
  title,
  sections,
}: {
  cta: { title: string; href: string };
  title: string;
  sections: { id: string; label: string }[];
}) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const buttonStyles =
    "bg-navy hover:!bg-ocean text-xs font-semibold rounded-[6px] px-3 py-[6px] min-h-0 min-w-0";

  const unselectedStyles =
    "bg-white hover:!bg-navy text-[#585858] hover:text-white text-xs font-semibold rounded-[6px] px-3 py-[6px] min-h-0 min-w-0";

  // Derive active section from scroll position to improve accuracy when scrolling up - this function worked
  //  better than IntersectionObserver alone or other alternatives I tried
  const updateActiveSectionFromOffsets = () => {
    const offset = 100; // match scroll offset logic
    const currentY = window.scrollY + offset;
    const candidates = sections
      .map(({ id }) => {
        const el = document.getElementById(id);
        return {
          id,
          top: el ? el.offsetTop : Number.POSITIVE_INFINITY,
        };
      })
      .filter((s) => Number.isFinite(s.top))
      .sort((a, b) => a.top - b.top);

    // Find the last section whose top is above or equal to the currentY
    let chosen = candidates[0]?.id || "";
    for (const c of candidates) {
      if (c.top <= currentY) {
        chosen = c.id;
      } else {
        break;
      }
    }
    if (chosen && chosen !== activeSection) {
      setActiveSection(chosen);
    }
  };

  const handleSectionClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;

      // Check if scrolling up or down
      const isScrollingUp = absoluteElementTop < window.scrollY;
      const offset = isScrollingUp ? 120 : 40;
      const offsetTop = absoluteElementTop - offset;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Navbar scroll handling effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;
      const scrollDelta = currentScrollY - lastScrollY;

      // Reset at top of page
      if (currentScrollY < scrollThreshold) {
        setIsNavbarOpen(false);
        setLastScrollY(currentScrollY);
        return;
      }

      // Handle scroll direction
      if (Math.abs(scrollDelta) > scrollThreshold) {
        // When scrolling up (negative delta), navbar is showing
        if (scrollDelta < 0) {
          setIsNavbarOpen(true);
        } else {
          // When scrolling down, navbar is hidden
          setIsNavbarOpen(false);
        }
      }

      setLastScrollY(currentScrollY);

      // Also update active section based on offsets for reliable upward scrolling
      updateActiveSectionFromOffsets();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Section detection effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible && mostVisible.target && mostVisible.target.id) {
          setActiveSection(mostVisible.target.id);
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
        // Slightly smaller top offset and less aggressive bottom for tablets
        rootMargin: "-80px 0px -35% 0px",
      }
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "w-full bg-white content-padding py-[15px] shadow-md sticky transition-all duration-300 z-10",
        // Use consistent, existing spacing tokens for better tablet behavior
        isNavbarOpen ? "top-16 md:top-20" : "top-0"
      )}
    >
      <div className="max-w-screen-content mx-auto w-full flex items-center justify-between">
        <p className="font-medium">{title}</p>

        <div className="hidden md:flex gap-2">
          {sections.map(({ id, label }) => (
            <Button
              key={id}
              intent="primary"
              onClick={(e) => handleSectionClick(e, id)}
              className={
                activeSection === id || (activeSection === "" && id === "about")
                  ? buttonStyles
                  : unselectedStyles
              }
            >
              {label}
            </Button>
          ))}
        </div>

        <Button href={cta.href} intent="primary" className={`${buttonStyles}`}>
          {cta.title}
        </Button>
      </div>
    </div>
  );
};
