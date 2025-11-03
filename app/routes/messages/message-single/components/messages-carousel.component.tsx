import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/primitives/shadcn-primitives/carousel";
import { useHits } from "react-instantsearch";
import { ContentItemHit } from "~/routes/search/types";
import { SeriesCard } from "./this-series-card.component";

export function RelatedMessagesCarousel() {
  const { items } = useHits<ContentItemHit>();

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full mt-6 relative mb-12"
    >
      <CarouselContent className="gap-6">
        {items.map((hit, index) => (
          <CarouselItem
            key={index}
            className="min-w-[318px] md:min-w-[460px] max-w-[460px] w-full pt-2"
          >
            <SeriesCard
              headingClass="text-text-primary"
              pClass="text-text-primary"
              message={{
                id: hit.rockItemId.toString(),
                title: hit.title,
                content: hit?.htmlContent || "",
                summary: hit.summary,
                image: hit.coverImage.sources[0].uri,
                coverImage: hit.coverImage.sources[0].uri,
                video: "",
                startDateTime: hit.startDateTime || "",
                expireDateTime: "",
                seriesId: "",
                seriesTitle: hit.sermonSeriesName || "",
                url: hit.url || hit.routing.pathname,
                primaryCategories:
                  hit.sermonPrimaryCategories?.map((tag) => ({ value: tag })) ||
                  [],
                secondaryCategories:
                  hit.sermonSecondaryCategories?.map((tag) => ({
                    value: tag,
                  })) || [],
                speaker: {
                  fullName: hit.author.firstName + " " + hit.author.lastName,
                  profilePhoto: "",
                  guid: "",
                },
              }}
            />
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
