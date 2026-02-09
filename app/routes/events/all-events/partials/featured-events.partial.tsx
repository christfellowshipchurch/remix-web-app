import { useLoaderData } from "react-router-dom";
import { Configure, InstantSearch, useHits } from "react-instantsearch";
import { EventReturnType } from "../loader";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { useMemo } from "react";
import { ContentItemHit } from "~/routes/search/types";
import { FeaturedEventCard } from "../components/featured-card.component";
import { createSearchClient } from "~/lib/create-search-client";
import {
  Carousel,
  CarouselArrows,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "~/primitives/shadcn-primitives/carousel";

export function FeaturedEvents() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<EventReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <div className="w-full py-28 bg-gray">
      <div className="flex flex-col max-w-screen-content mx-auto">
        <InstantSearch
          indexName="dev_daniel_contentItems"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure
            filters='contentType:"Event" AND isFeatured:true'
            hitsPerPage={4}
          />

          <FeaturedEventsHits />
        </InstantSearch>
      </div>
    </div>
  );
}

const FeaturedEventsHits = () => {
  const { items } = useHits<ContentItemHit>();
  const firstHit = items[0];
  const remainingHits = items.slice(1);

  if (!firstHit) return null;

  return (
    <>
      <div className="content-padding">
        <FeaturedEventCard card={firstHit} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden mt-16 lg:mt-24 md:grid grid-cols-2 lg:grid-cols-3 gap-4 place-items-center md:place-items-start content-padding">
        {remainingHits?.map((hit) => (
          <OtherFeatureEventCardHit hit={hit} key={hit.objectID} />
        ))}
      </div>

      {/* Mobile Layout - Carousel */}
      {remainingHits.length > 0 && (
        <div className="mt-12 md:hidden">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="py-2 gap-4">
              {remainingHits.map((hit, index) => (
                <CarouselItem
                  key={hit.objectID}
                  className="w-full basis-[360px] pl-0"
                  style={{
                    marginLeft: index === 0 ? "20px" : "0px",
                    marginRight:
                      index === remainingHits.length - 1 ? "20px" : "0px",
                  }}
                >
                  <OtherFeatureEventCardHit hit={hit} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="w-full relative mt-4 pb-4">
              <div className="absolute h-12 top-7 left-5">
                <CarouselDots
                  activeClassName="bg-ocean"
                  inactiveClassName="bg-neutral-lighter"
                />
              </div>

              <div className="absolute h-12 right-44 lg:right-44 2xl:right-36 3xl:right-28">
                <CarouselArrows />
              </div>
            </div>
          </Carousel>
        </div>
      )}
    </>
  );
};

const OtherFeatureEventCardHit = ({ hit }: { hit: ContentItemHit }) => {
  const formattedDate = new Date(hit.startDateTime).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <ResourceCard
      className="min-w-[360px] w-[360px] md:w-full md:min-w-0"
      resource={{
        id: hit.objectID,
        contentChannelId: "78", // EVENT type from builder-utils.ts
        contentType: "EVENTS",
        name: hit.title,
        summary: hit.cardSubtitle || hit.summary || "",
        image: hit.coverImage.sources[0].uri,
        pathname: `/events/${hit.url}`,
        startDate: formattedDate,
        location:
          hit.locations && hit.locations.length > 1
            ? "Multiple Locations"
            : hit.locations?.[0]?.name || "Christ Fellowship Church",
      }}
    />
  );
};
