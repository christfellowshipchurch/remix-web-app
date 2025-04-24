import { Link } from "react-router";
import { Button } from "~/primitives/button/button.primitive";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/primitives/shadcn-primitives/carousel";
import { useEffect, useState } from "react";

const HERO_IMAGES = [
  {
    src: "/assets/images/home-hero-1.webp",
    alt: "friends at church 1",
  },
  {
    src: "/assets/images/home-hero-2.webp",
    alt: "friends at church 2",
  },
  {
    src: "/assets/images/home-hero-3.webp",
    alt: "welcome to church",
  },
  {
    src: "/assets/images/home-hero-4.webp",
    alt: "family at church",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === HERO_IMAGES.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="h-screen w-full bg-white pb-16">
      <div className="flex h-full">
        {/* Left Column */}
        <div className="flex-1 flex flex-col justify-center pl-8 pr-16">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <Link to="/locations" prefetch="intent">
            <Button intent="secondary" className="text-white border-white">
              Times and Locations
            </Button>
          </Link>
        </div>
        {/* Right Column - Auto Sliding Carousel */}
        <div className="flex-1 relative">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full">
              {HERO_IMAGES.map((image, index) => (
                <CarouselItem
                  key={index}
                  className={`h-full ${
                    currentSlide === index ? "block" : "hidden"
                  }`}
                >
                  <div className="w-full h-full bg-to-t from-transparent via-white via-75% to-white opacity-75" />
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
