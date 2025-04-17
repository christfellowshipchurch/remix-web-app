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

export const ScrollComponent = (data: {
  items: Message[] | SeriesResource[];
  title: string;
  summary?: string;
  bg?: string;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className={`content-padding py-28 bg-${data.bg || "white"}`}>
      <div className="max-w-screen-content mx-auto">
        <div className="flex flex-col gap-12 lg:gap-20">
          <div className="flex flex-col gap-3 md:gap-4">
            <h2 className="text-2xl lg:text-[52px] font-extrabold">
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
                  className="w-full aspect-video basis-[75%] sm:basis-[50%] lg:basis-[31.5%] pl-0"
                >
                  {/* <ResourceCard series={item} /> */}
                  <div>Testing {index}</div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-0 -bottom-7">
              {/* Add dots here */}
              <div className="flex gap-2">
                {data.items.map((item, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? "bg-navy" : "bg-neutral-lighter"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-7 right-8">
              <CarouselPrevious
                className="left-0 border-navy disabled:border-[#AAAAAA]"
                fill="#004f71"
                disabledFill="#AAAAAA"
                onClick={() =>
                  setCurrentSlide(currentSlide !== 0 ? currentSlide - 1 : 0)
                }
              />
              <CarouselNext
                className="left-12 border-navy disabled:border-[#AAAAAA]"
                fill="#004f71"
                disabledFill="#AAAAAA"
                onClick={() =>
                  setCurrentSlide(
                    currentSlide !== data.items.length - 1
                      ? currentSlide + 1
                      : data.items.length - 1
                  )
                }
              />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
