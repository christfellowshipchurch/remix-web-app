import { HeroCard } from "../components/hero-card.component";
import { useRef, useEffect } from "react";

export const Hero = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Create a looped array by duplicating cards
  const loopedCards = [...mockCards, ...mockCards, ...mockCards];

  // Handle infinite scroll effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Calculate dimensions
    const centerCardIndex = Math.floor(mockCards.length / 2);
    const largeCardWidth = 350;
    const smallCardWidth = 282;
    const cardGap = 16;

    // Calculate actual width of one complete set
    let setWidth = 0;
    for (let i = 0; i < mockCards.length; i++) {
      const cardWidth = i === centerCardIndex ? largeCardWidth : smallCardWidth;
      setWidth += cardWidth + cardGap;
    }
    setWidth -= cardGap; // Remove the last gap

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      // Jump to middle set when reaching edges, maintaining relative position
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        // When scrolling right, calculate position relative to viewport
        const viewportPosition = scrollLeft - (scrollWidth - clientWidth);
        const newPosition = setWidth + viewportPosition + 28;
        scrollContainer.scrollLeft = newPosition;
      } else if (scrollLeft <= 10) {
        // When scrolling left, jump to middle set + the scroll position
        const newPosition = setWidth + scrollLeft;
        scrollContainer.scrollLeft = newPosition;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Calculate center card position within middle set
    let centerCardPosition = setWidth; // Start of middle set
    for (let i = 0; i < centerCardIndex; i++) {
      centerCardPosition +=
        (i === centerCardIndex ? largeCardWidth : smallCardWidth) + cardGap;
    }

    // Center the large card in viewport
    const centerPosition =
      centerCardPosition - scrollContainer.clientWidth / 2 + largeCardWidth / 2;

    // Initialize scroll position
    scrollContainer.scrollLeft = centerPosition;

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="flex flex-col pt-16 pb-8 items-center justify-center gap-12"
      style={{
        backgroundImage: "url(/assets/images/info-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-[32px] text-[#001D26] font-extrabold">
        Take your next <span className="text-ocean">step...</span>
      </h1>

      {/* Horizontally Scrollable Cards */}
      <div className="w-full">
        <div
          ref={scrollContainerRef}
          className="flex items-center 3xl:justify-center gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {loopedCards.map((card, index) => {
            // Calculate which card should be the center card (relative to original set)
            const originalIndex = index % mockCards.length;
            const centerCardIndex = Math.floor(mockCards.length / 2);
            const isCenterCard = originalIndex === centerCardIndex;

            return (
              <div
                key={index}
                className={`flex-shrink-0 ${
                  isCenterCard ? "w-[350px]" : "w-[282px]"
                }`}
              >
                <HeroCard {...card} size={isCenterCard ? "large" : "normal"} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const mockCards = [
  {
    image: "/assets/images/info-bg.jpg",
    cta: {
      label: "Testing",
      href: "/donate",
    },
  },
  {
    image: "/assets/images/info-bg.jpg",
    cta: {
      label: "Shop Now",
      href: "/donate",
    },
  },
  {
    image: "/assets/images/info-bg.jpg",
    cta: {
      label: "Register",
      href: "/donate",
    },
  },
  {
    image: "/assets/images/info-bg.jpg",
    cta: {
      label: "Times & Locations",
      href: "/donate",
    },
  },
  {
    image: "/assets/images/info-bg.jpg",
    cta: {
      label: "Donate",
      href: "/donate",
    },
  },
];
