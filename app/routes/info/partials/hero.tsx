import { HeroCard } from "../components/hero-card.component";
import { useRef, useEffect, useState } from "react";

export const Hero = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [centeredCardIndex, setCenteredCardIndex] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const [cards, setCards] = useState([
    ...mockCards,
    ...mockCards,
    ...mockCards,
  ]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Card dimensions
    const largeCardWidth = 350;
    const smallCardWidth = 282;
    const cardGap = 16;
    const centerCardIndex = Math.floor(mockCards.length / 2);

    // Calculate width of one complete set
    const setWidth =
      mockCards.reduce((width, _, i) => {
        const cardWidth =
          i === centerCardIndex ? largeCardWidth : smallCardWidth;
        return width + cardWidth + cardGap;
      }, 0) - cardGap;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Find the card closest to center
      const cardElements = scrollContainer.querySelectorAll(".hero-card");
      let minDiff = Infinity;
      let centerIdx = 0;

      cardElements.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const diff = Math.abs(cardCenter - containerCenter);
        if (diff < minDiff) {
          minDiff = diff;
          centerIdx = i;
        }
      });

      setCenteredCardIndex(centerIdx);

      // Infinite scroll
      if (scrollLeft >= scrollWidth - clientWidth - 200) {
        setCards((prev) => [...prev, ...mockCards]);
      } else if (scrollLeft <= 10) {
        setCards((prev) => [...mockCards, ...prev]);
        scrollContainer.scrollLeft = scrollLeft + setWidth;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Initialize scroll position to center the middle set
    const centerPosition =
      setWidth - scrollContainer.clientWidth / 2 + largeCardWidth / 2;
    scrollContainer.scrollLeft = centerPosition;

    const timer = setTimeout(() => setIsVisible(true), 50);

    return () => {
      clearTimeout(timer);
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex flex-col pt-16 pb-8 items-center justify-center gap-12 ${
        isVisible ? "animate-fadeIn duration-400" : "opacity-0"
      }`}
      style={{
        backgroundImage: "url(/assets/images/info-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-[32px] text-[#001D26] font-extrabold">
        Take your next <span className="text-ocean">step...</span>
      </h1>

      <div className="w-full">
        <div
          ref={scrollContainerRef}
          className="flex items-center 3xl:justify-center gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
        >
          {cards.map((card, index) => {
            const isCenterCard = index === centeredCardIndex;
            return (
              <div
                key={`${card.cta.label}-${index}`}
                className={`hero-card flex-shrink-0 snap-center transition-all duration-100 p-7 w-[306px] ${
                  isCenterCard ? "scale-115 " : "scale-100"
                }`}
              >
                <HeroCard {...card} />
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
    cta: { label: "1", href: "/donate" },
  },
  {
    image: "/assets/images/info-bg.jpg",
    cta: { label: "2", href: "/donate" },
  },
  {
    image: "/assets/images/info-bg.jpg",
    cta: { label: "3", href: "/donate" },
  },
  {
    image: "/assets/images/info-bg.jpg",
    cta: { label: "4", href: "/donate" },
  },
  {
    image: "/assets/images/info-bg.jpg",
    cta: { label: "5", href: "/donate" },
  },
];
