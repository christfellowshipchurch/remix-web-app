import { Configure, InstantSearch } from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";
import { useMemo, useState } from "react";
import { GroupHit } from "../../group-finder/components/group-hit.component";
import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";
import { CardCarousel } from "~/components/resource-carousel";
import {
  GroupType,
  GROUPS_ALGOLIA_INDEX_NAME,
  splitGroupTopics,
} from "~/routes/group-finder/types";
import { createSearchClient } from "~/lib/create-search-client";
import { escapeAlgoliaFilterString } from "~/components/finders/finder-algolia.utils";
import { CollectionItem } from "~/routes/page-builder/types";
import { GetHits } from "~/components/get-hits";

// Custom component to use hits data with ResourceCarousel
function RelatedGroupsHits({
  hits,
  currentGroupName,
}: {
  hits: GroupType[];
  currentGroupName?: string;
}) {
  // Filter out the current group from the results
  const filteredItems = hits.filter(
    (item) => !currentGroupName || item.title !== currentGroupName,
  );

  // Wrapper component to adapt resource prop to hit prop
  const HitComponentWrapper = ({ resource }: { resource: CollectionItem }) => {
    return <GroupHit hit={resource as unknown as GroupType} />;
  };

  return (
    <CardCarousel
      CardComponent={HitComponentWrapper}
      resources={filteredItems as unknown as CollectionItem[]}
      mode="light"
      layout="arrowsRight"
      /* Avoid clipping carousel chrome; viewport already clips slides via Embla. */
      carouselClassName="w-full min-w-0 max-w-full"
      carouselItemClassName="w-full max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px]"
    />
  );
}

export function RelatedGroupsPartial({
  topics,
  currentGroupName,
}: {
  /** Raw `topics` field from the group Algolia record (comma-separated or empty). */
  topics: string;
  currentGroupName?: string;
}) {
  const [hits, setHits] = useState<GroupType[]>([]);
  const topicTags = splitGroupTopics(topics);

  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  return (
    <InstantSearch
      indexName={GROUPS_ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure
        filters={
          topicTags[0]
            ? `topics:"${escapeAlgoliaFilterString(topicTags[0])}"`
            : undefined
        }
        hitsPerPage={6}
      />
      <GetHits setHits={setHits} />
      {hits.length > 1 ? (
        <div className="content-padding mt-20 w-full flex flex-col items-center bg-linear-to-b from-white to-[#EEE] pb-24">
          <div className="w-full flex flex-col gap-6 md:gap-12 max-w-screen-content">
            <div className="w-full flex justify-between items-center">
              <h2 className="text-lg md:text-[28px] lg:text-[32px] font-extrabold">
                Related Groups
              </h2>
              <div className="hidden md:block">
                <Button
                  intent="secondary"
                  href={`/group-finder/topics/${topicTags[0]}`}
                >
                  View All
                </Button>
              </div>
            </div>

            <div className="flex w-full min-w-0 max-w-full gap-4 overflow-x-hidden">
              {/* Results using ResourceCarousel */}
              <RelatedGroupsHits
                hits={hits}
                currentGroupName={currentGroupName}
              />
            </div>

            {/* Mobile Button */}
            <div className="md:hidden w-full flex">
              <Button
                intent="secondary"
                href={`/group-finder/topics/${topicTags[0]}`}
              >
                View All
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white w-full h-full py-10" />
      )}
    </InstantSearch>
  );
}
