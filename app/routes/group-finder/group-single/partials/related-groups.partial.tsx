import { Configure, InstantSearch } from "react-instantsearch";
import { Hits } from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";
import { useMemo } from "react";
import { HitComponent } from "../../finder/components/location-search/hit-component.component";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";
import { useResponsive } from "~/hooks/use-responsive";
import { createSearchClient } from "~/routes/messages/all-messages/components/all-messages.component";

export function RelatedGroupsPartial({ tags }: { tags: string[] }) {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  const { isLarge, isXLarge } = useResponsive();

  return (
    <div className="content-padding mt-20 w-full flex flex-col items-center bg-gradient-to-b from-white to-[#EEE] pb-24">
      <div className="w-full flex flex-col gap-6 md:gap-16 max-w-screen-content">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg md:text-[28px] lg:text-[32px] font-extrabold">
            Related Groups
          </h2>
          <div className="hidden md:block">
            <Button intent="secondary" href={`/group-finder/tags/${tags[0]}`}>
              View More
            </Button>
          </div>
        </div>

        <div className="w-full flex justify-center gap-4">
          <InstantSearch
            indexName="production_Groups"
            searchClient={searchClient}
            future={{
              preserveSharedStateOnUnmount: true,
            }}
          >
            <Configure
              filters={`preferences:"${tags[0]}"`}
              hitsPerPage={isXLarge ? 4 : isLarge ? 3 : 4}
            />
            {/* Results Grid */}
            <Hits
              hitComponent={HitComponent}
              classNames={{
                list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 justify-center max-w-[400px] md:max-w-none",
              }}
            />
          </InstantSearch>
        </div>
        <div className="md:hidden w-full flex justify-center mt-6">
          <Button intent="secondary" href={`/group-finder/tags/${tags[0]}`}>
            View More
          </Button>
        </div>
      </div>
    </div>
  );
}
