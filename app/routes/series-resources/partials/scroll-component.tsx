import { SeriesResource } from "../loader";
import { Message } from "~/routes/messages/message-single/loader";
import {
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/primitives/shadcn-primitives/carousel";
import { Carousel } from "~/primitives/shadcn-primitives/carousel";
import { useState } from "react";
import { ResourceCard } from "~/components/resource-card";
import { useResponsive } from "~/hooks/use-responsive";

export const ScrollComponent = (data: {
  items: Message[] | SeriesResource[];
  title: string;
  summary?: string;
  bg?: string;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsLength = data.items.length;
  const { isMedium, isLarge } = useResponsive();

  let itemsPerSlide = 1;
  if (isMedium) {
    itemsPerSlide = 2;
  } else if (isLarge) {
    itemsPerSlide = 3;
  }

  const slides = itemsLength - itemsPerSlide + 1;

  return (
    <div
      className={`pl-6 md:content-padding pb-28 pt-16 lg:pt-28 bg-${
        data.bg || "white"
      }`}
    >
      <div className="max-w-screen-content mx-auto">
        <div className="flex flex-col gap-11 lg:gap-20">
          <div className="flex flex-col gap-3 md:gap-4">
            <h2 className="text-2xl lg:text-[52px] font-extrabold leading-none">
              {data.title}
            </h2>
            {data.summary && <p className="lg:text-lg">{data.summary}</p>}
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full relative"
          >
            <CarouselContent className="gap-6">
              {data.items.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="w-full aspect-video basis-[85%] sm:basis-[50%] lg:basis-[31.5%] pl-0"
                >
                  <ResourceCard
                    title={item.title}
                    description={item.summary}
                    image={item.coverImage}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-between w-full absolute -bottom-8">
              {/* Dots */}
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(slides) }, (_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? "bg-navy" : "bg-neutral-lighter"
                    }`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-4">
                <div
                  onClick={() =>
                    setCurrentSlide(currentSlide !== 0 ? currentSlide - 1 : 0)
                  }
                >
                  <CarouselPrevious
                    className="right-16 left-auto border-navy disabled:border-[#AAAAAA]"
                    fill="#004f71"
                    disabledFill="#AAAAAA"
                  />
                </div>
                <div
                  onClick={() =>
                    setCurrentSlide(
                      currentSlide !== data.items.length - 1
                        ? currentSlide + 1
                        : data.items.length - 1
                    )
                  }
                >
                  <CarouselNext
                    className="right-4 border-navy disabled:border-[#AAAAAA]"
                    fill="#004f71"
                    disabledFill="#AAAAAA"
                  />
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
