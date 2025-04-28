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
import { ContentChannelIds } from "~/lib/rock-config";

const contentChannelUrlMap: Record<number, string> = {
  [ContentChannelIds.messages]: "/messages",
  [ContentChannelIds.articles]: "/articles",
  [ContentChannelIds.devotionals]: "/devotionals",
  [ContentChannelIds.events]: "/events",
  [ContentChannelIds.studies[0]]: "/studies",
  [ContentChannelIds.studies[1]]: "/studies",
  [ContentChannelIds.soGoodSisterhood]: "/so-good-sisterhood",
  [ContentChannelIds.keepTalking]: "/keep-talking",
};

export const ResourceCarousel = (data: {
  // Items will be Message[] or any[] depending on the type of items (Resources are anything tagged with the series defined value that is not a message)
  items: Message[] | any[];
  title: string;
  summary?: string;
  bg?: string;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsLength = data.items.length;
  const { isMedium, isLarge } = useResponsive();

  let itemsPerSlide = 1;
  let showDots = itemsLength > 1;
  if (isMedium) {
    itemsPerSlide = 2;
    showDots = itemsLength > 2;
  } else if (isLarge) {
    itemsPerSlide = 3;
    showDots = itemsLength > 3;
  }

  const slides = itemsLength - itemsPerSlide + 1;

  return (
    <div
      className={`pl-6 md:pl-12 lg:pl-18 pb-28 pt-16 lg:pt-28 bg-${
        data.bg || "white"
      }`}
    >
      <div className="xl:max-w-screen-content xl:mx-auto">
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
                  className="w-full basis-[85%] sm:basis-[46%] lg:basis-auto max-w-[420px] pl-0 flex flex-col items-stretch"
                  style={{
                    paddingRight:
                      index === itemsLength - 1 && itemsLength > 1
                        ? "24px"
                        : "0px",
                  }}
                >
                  <ResourceCard
                    title={item.title}
                    description={item.attributeValues.summary.value}
                    image={item.coverImage}
                    url={`${
                      contentChannelUrlMap[item.contentChannelId] || ""
                    }/${item.attributeValues.url.value}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-between w-full absolute -bottom-8">
              {/* Dots */}
              {showDots && (
                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(slides) }, (_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        currentSlide === index
                          ? "bg-navy"
                          : "bg-neutral-lighter"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Arrows */}
              {itemsLength > 1 && (
                <CarouselArrows
                  currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide}
                  itemsLength={itemsLength}
                />
              )}
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

const CarouselArrows = ({
  currentSlide,
  setCurrentSlide,
  itemsLength,
}: {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  itemsLength: number;
}) => {
  return (
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
            currentSlide !== itemsLength - 1
              ? currentSlide + 1
              : itemsLength - 1
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
  );
};
