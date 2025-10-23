import { Configure, InstantSearch } from "react-instantsearch";
import { useHits } from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";
import { useMemo } from "react";
import { GroupHit } from "../../group-finder/components/group-hit.component";
import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";
import { CardCarousel } from "~/components/resource-carousel";
import { GroupType } from "~/routes/group-finder/types";
import { createSearchClient } from "~/lib/create-search-client";
import { CollectionItem } from "~/routes/page-builder/types";

// Custom component to use hits data with ResourceCarousel
function RelatedGroupsHits({
  currentGroupName,
}: {
  currentGroupName?: string;
}) {
  const { items } = useHits<GroupType>();

  // Filter out the current group from the results
  const filteredItems = items.filter(
    (item) => !currentGroupName || item.title !== currentGroupName
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
      carouselClassName="overflow-hidden w-screen"
      carouselItemClassName="w-full max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px]"
    />
  );
}

export function RelatedGroupsPartial({
  topics,
  currentGroupName,
}: {
  topics: string[];
  currentGroupName?: string;
}) {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <div className="content-padding mt-20 w-full flex flex-col items-center bg-gradient-to-b from-white to-[#EEE] pb-24">
      <div className="w-full flex flex-col gap-6 md:gap-16 max-w-screen-content">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg md:text-[28px] lg:text-[32px] font-extrabold">
            Related Groups
          </h2>
          <div className="hidden md:block">
            <Button
              intent="secondary"
              href={`/group-finder/topics/${topics[0]}`}
            >
              View All
            </Button>
          </div>
        </div>

        <div className="w-full flex gap-4 md:-mt-12">
          <InstantSearch
            indexName="dev_daniel_Groups"
            searchClient={searchClient}
            future={{
              preserveSharedStateOnUnmount: true,
            }}
          >
            <Configure filters={`topics:"${topics[0]}"`} hitsPerPage={6} />

            {/* Results using ResourceCarousel */}
            <RelatedGroupsHits currentGroupName={currentGroupName} />
          </InstantSearch>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden w-full flex mt-6">
          <Button intent="secondary" href={`/group-finder/topics/${topics[0]}`}>
            View All
          </Button>
        </div>
      </div>
    </div>
  );
}
