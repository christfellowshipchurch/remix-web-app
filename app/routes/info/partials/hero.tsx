import { HeroCard } from "../components/hero-card.component";
import { useRef, useEffect, useState } from "react";

export const Hero = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [centeredCardIndex, setCenteredCardIndex] = useState(2); // Start with middle card centered

  // Create a looped array by duplicating cards
  const loopedCards = [...mockCards, ...mockCards, ...mockCards];

  // Handle infinite scroll effect with snapping
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
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let minDiff = Infinity;
      let centerIdx = 0;

      // Find the card closest to center
      const cards = scrollContainer.querySelectorAll(".hero-card");
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const diff = Math.abs(cardCenter - containerCenter);
        if (diff < minDiff) {
          minDiff = diff;
          centerIdx = i;
        }
      });

      // Update the centered card index
      setCenteredCardIndex(centerIdx);

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
          className="flex items-center 3xl:justify-center gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {loopedCards.map((card, index) => {
            // Determine if this card should be large based on whether it's the centered card
            const isCenterCard = index === centeredCardIndex;

            return (
              <div
                key={index}
                className={`hero-card flex-shrink-0 snap-center ${
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
