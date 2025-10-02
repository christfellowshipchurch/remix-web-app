import { useEffect, useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";

export const EventBanner = ({ title }: { title: string }) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const buttonStyles =
    "bg-navy hover:!bg-ocean text-xs font-semibold rounded-[6px] px-3 py-[6px] min-h-0 min-w-0";

  const unselectedStyles =
    "bg-white hover:!bg-navy text-[#585858] hover:text-white text-xs font-semibold rounded-[6px] px-3 py-[6px] min-h-0 min-w-0";

  const sections = [
    { id: "about", label: "About" },
    { id: "faq", label: "FAQ" },
    { id: "register", label: "Register" },
  ];

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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Section detection effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-100px 0px -50% 0px",
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
        isNavbarOpen ? "top-18 md:top-22" : "top-0"
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

        <Button intent="primary" className={`${buttonStyles}`}>
          Save My Spot
        </Button>
      </div>
    </div>
  );
};
