import { HeroCard } from "../components/hero-card.component";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
} from "~/primitives/shadcn-primitives/carousel";

export const Hero = () => {
  const [showDots, setShowDots] = useState(true);
  const [api, setApi] = useState<any>(null);

  const itemsPerSlide = 3; // Show 3 cards per slide
  const totalSlides = Math.ceil(mockCards.length / itemsPerSlide);

  // Calculate if all cards fit on screen
  useEffect(() => {
    const checkIfAllCardsFit = () => {
      const containerWidth = window.innerWidth;
      const cardWidth = 282; // Normal card width
      const largeCardWidth = 350; // Large card width
      const gap = 16; // Gap between cards

      // Calculate total width needed for all cards
      const totalWidthNeeded =
        mockCards.reduce((total, _, index) => {
          // Use the same logic as the render to determine center card
          const centerCardIndex = 1; // Center card of first slide
          const cardSize =
            index === centerCardIndex ? largeCardWidth : cardWidth;
          return total + cardSize + gap;
        }, 0) - gap; // Subtract the last gap

      setShowDots(totalWidthNeeded > containerWidth);
    };

    checkIfAllCardsFit();
    window.addEventListener("resize", checkIfAllCardsFit);

    return () => window.removeEventListener("resize", checkIfAllCardsFit);
  }, []);

  // Scroll to center card on load
  useEffect(() => {
    if (api) {
      // Scroll to the center card (index 1) after a short delay to ensure carousel is ready
      const timer = setTimeout(() => {
        api.scrollTo(1);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [api]);

  return (
    <div className="flex flex-col pt-16 pb-8 items-center justify-center gap-8">
      <h1 className="text-2xl text-[#001D26] font-extrabold">
        Take your next <span className="text-ocean">step...</span>
      </h1>

      {/* Hero Carousel */}
      <div className="relative w-full">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="flex items-center gap-4 px-4">
            {mockCards.map((card, index) => {
              // Calculate which card should be the center card based on current slide
              const centerCardIndex = 1; // Center card of current slide
              const isCenterCard = index === centerCardIndex;

              return (
                <CarouselItem
                  key={index}
                  className={`pl-0 ${
                    isCenterCard ? "basis-[350px]" : "basis-[282px]"
                  }`}
                >
                  <HeroCard
                    {...card}
                    size={isCenterCard ? "large" : "normal"}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Navigation Controls */}
          <div className="relative mt-8">
            {/* Dots */}
            {showDots && <CarouselDots />}
          </div>
        </Carousel>
      </div>
    </div>
  );
};

const CarouselDots = () => {
  const { api, currentSlide } = useCarousel();
  const slides = api?.scrollSnapList() || [];

  return (
    <div className="flex justify-center">
      <div className="flex gap-2">
        {slides.length > 1 &&
          slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-ocean" : "bg-neutral-lighter"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
      </div>
    </div>
  );
};

const mockCards = [
  {
    image: "https://picsum.photos/150/150",
    cta: {
      label: "Testing",
      href: "/donate",
    },
  },
  {
    image: "https://picsum.photos/150/150",
    cta: {
      label: "Shop Now",
      href: "/donate",
    },
  },
  {
    image: "https://picsum.photos/150/150",
    cta: {
      label: "Register",
      href: "/donate",
    },
  },
  {
    image: "https://picsum.photos/150/150",
    cta: {
      label: "Times & Locations",
      href: "/donate",
    },
  },
  {
    image: "https://picsum.photos/150/150",
    cta: {
      label: "Donate",
      href: "/donate",
    },
  },
  {
    image: "https://picsum.photos/150/150",
    cta: {
      label: "Donate",
      href: "/donate",
    },
  },
];
