import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/primitives/shadcn-primitives/carousel";
import { useMemo } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, Configure, useHits } from "react-instantsearch";
import { ContentItemHit } from "~/routes/search/types";

import { Link, useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";

const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});

export function MessagesCarousel() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, message } =
    useLoaderData<LoaderReturnType>();
  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  // Create filter for the primary category and sermon type
  // If primary category exists, filter by it; otherwise show all sermons (Recent)
  const categoryFilter = message.primaryCategories[0]?.value
    ? `contentType:"Sermon" AND sermonPrimaryTags:"${message.primaryCategories[0]?.value}" AND NOT title:"${message.title}"`
    : `contentType:"Sermon" AND NOT title:"${message.title}"`;

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full mt-6 relative mb-12"
    >
      <InstantSearch
        indexName="dev_daniel_contentItems"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure filters={categoryFilter} hitsPerPage={10} />
        <CarouselContent className="gap-6">
          <CarouselHits />
        </CarouselContent>
      </InstantSearch>
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

const CarouselHits = () => {
  const { items } = useHits<ContentItemHit>();
  const hoverClasses =
    "group-hover:translate-y-[-6px] transition-all duration-300";

  return (
    <>
      {items.map((hit, index) => (
        <CarouselItem
          key={index}
          className="min-w-[318px] md:min-w-[460px] max-w-[460px] w-full pt-2"
        >
          <Link
            to={`/messages/${hit.url}`}
            prefetch="intent"
            className="min-w-[318px] md:min-w-[460px] max-w-[460px] h-full max-h-[260px] group"
          >
            <img
              src={hit.coverImage.sources[0].uri}
              className={`w-full aspect-video rounded-[8px] ${hoverClasses}`}
            />
          </Link>
        </CarouselItem>
      ))}
    </>
  );
};
