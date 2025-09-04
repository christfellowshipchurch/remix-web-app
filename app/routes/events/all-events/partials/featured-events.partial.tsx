import { useLoaderData } from "react-router-dom";
import { Configure, InstantSearch, useHits } from "react-instantsearch";
import { EventReturnType } from "../loader";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { useMemo } from "react";
import { ContentItemHit } from "~/routes/search/types";
import { FeaturedEventCard } from "../components/featured-card.component";
import { createSearchClient } from "~/lib/create-search-client";

export function FeaturedEvents() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<EventReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <div className="w-full py-28 bg-gray content-padding">
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
      <FeaturedEventCard card={firstHit} />
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center md:place-items-start">
        {remainingHits?.map((hit) => (
          <OtherFeatureEventCardHit hit={hit} key={hit.objectID} />
        ))}
      </div>
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
      resource={{
        id: hit.objectID,
        contentChannelId: "78", // EVENT type from builder-utils.ts
        contentType: "EVENT",
        name: hit.title,
        summary: hit.summary,
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
