import { useLoaderData } from "react-router-dom";
import { EventReturnType } from "../loader";
import { SectionTitle } from "~/components";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { createSearchClient } from "~/routes/messages/all-messages/components/all-messages.component";
import { Configure, Hits, InstantSearch } from "react-instantsearch";
import { CustomPagination } from "~/routes/messages/all-messages/components/custom-pagination.component";
import { useMemo } from "react";
import { ContentItemHit } from "~/routes/search/types";
import { EventsTagsRefinementList } from "../components/events-tags-refinement.component";

export const EventsForYou = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<EventReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <div className="w-full pt-16 pb-28 content-padding">
      <div className="flex flex-col max-w-screen-content mx-auto">
        <SectionTitle
          title="Discover Events For You"
          sectionTitle="all events."
        />
        <InstantSearch
          indexName="dev_daniel_contentItems"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure
            filters='contentType:"Event" AND isFeatured:false'
            hitsPerPage={9}
          />

          {/* Filters */}
          <div className="mt-10 mb-16 md:mt-14 lg:mb-24 xl:mb-28">
            <EventsTagsRefinementList />
          </div>

          <Hits
            hitComponent={({ hit }: { hit: ContentItemHit }) => {
              return <EventHit hit={hit} />;
            }}
            classNames={{
              list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center",
            }}
          />

          <CustomPagination />
        </InstantSearch>
      </div>
    </div>
  );
};

const EventHit = ({ hit }: { hit: ContentItemHit }) => {
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
