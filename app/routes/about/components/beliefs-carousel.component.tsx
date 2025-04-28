import { cn } from "~/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/primitives/shadcn-primitives/carousel";
import { beliefsData } from "../about.data";

export function BeliefsCarousel() {
  return (
    <div className="z-30">
      <img
        src="/assets/images/about/beliefs.webp"
        alt="Beliefs"
        className="w-full"
      />
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full relative mb-12"
        >
          <CarouselContent>
            {beliefsData.map((belief, index) => (
              <CarouselItem
                key={belief.title}
                className={cn(
                  "pl-0",
                  "basis-[100%]",
                  "md:basis-[50%]",
                  "lg:basis-[33.333%]"
                )}
              >
                <div
                  className={cn(
                    "px-6 py-12 bg-gray h-full",
                    index !== beliefsData.length - 1 &&
                      "border-r border-neutral-lighter"
                  )}
                >
                  <h4 className="text-3xl text-text-primary font-extrabold mb-4">
                    {belief.title}
                  </h4>
                  <p className="text-lg text-dark-navy">{belief.verses}</p>
                  {belief.description && (
                    <p className="text-text-primary mt-4">
                      {belief.description}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex px-6 items-center justify-between h-18 w-full bg-navy">
            <CarouselDots
              activeClassName="bg-white"
              inactiveClassName="bg-white opacity-50"
            />
            <div className="relative flex mr-6">
              <CarouselPrevious
                className="cursor-pointer hover:bg-white/20 border-white disabled:border-neutral-light"
                fill="white"
                disabledFill="#AAAAAA"
              />
              <CarouselNext
                className="-left-2 cursor-pointer hover:bg-white/20 border-white disabled:border-neutral-light"
                fill="white"
                disabledFill="#AAAAAA"
              />
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
