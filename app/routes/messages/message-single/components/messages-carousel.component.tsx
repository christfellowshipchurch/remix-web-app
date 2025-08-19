import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/primitives/shadcn-primitives/carousel";
// import { OtherSeriesCard } from "./other-series-card.component";
import { MessageType } from "~/routes/messages/types";

export function MessagesCarousel({ messages }: { messages: MessageType[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full mt-8 relative mb-12"
    >
      <CarouselContent className="gap-6">
        {messages.map((message, index) => (
          <CarouselItem
            key={index}
            className="w-full aspect-video basis-[75%] sm:basis-[50%] lg:basis-[31.5%] pl-0"
          >
            {/* <OtherSeriesCard series={message} /> */}
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute -bottom-7">
        <CarouselPrevious
          className="left-0 border-navy disabled:border-[#AAAAAA]"
          fill="#004f71"
          disabledFill="#AAAAAA"
        />
        <CarouselNext
          className="left-12 border-navy disabled:border-[#AAAAAA]"
          fill="#004f71"
          disabledFill="#AAAAAA"
        />
      </div>
    </Carousel>
  );
}
