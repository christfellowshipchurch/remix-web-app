import { Configure, InstantSearch, RefinementList } from "react-instantsearch";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Hits } from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";
import { useMemo } from "react";
import { HitComponent } from "../../finder/components/hit-component.component";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";

const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});

export function RelatedGroupsPartial() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, tags } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <div className="content-padding w-full flex flex-col items-center bg-gradient-to-b from-white to-[#EEE] pb-24">
      <div className="mt-8 w-full flex flex-col gap-16 max-w-screen-content">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-[32px] font-extrabold">Related Groups</h2>
          <Button intent="secondary" href={`/group-finder/tags/${tags[0]}`}>
            View More
          </Button>
        </div>
        <div className="w-full flex gap-4">
          <InstantSearch
            indexName="production_Groups"
            searchClient={searchClient}
            future={{
              preserveSharedStateOnUnmount: true,
            }}
          >
            <Configure filters={`preferences:"${tags[0]}"`} hitsPerPage={4} />
            {/* Results Grid */}
            <Hits
              hitComponent={HitComponent}
              classNames={{
                list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center",
              }}
            />
          </InstantSearch>
        </div>
      </div>
    </div>
  );
}
