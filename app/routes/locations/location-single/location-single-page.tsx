import { useLoaderData } from "react-router-dom";
import { useMemo } from "react";
import { createSearchClient } from "../../messages/all-messages/components/all-messages.component";
import { LoaderReturnType } from "./loader";
import { Configure, InstantSearch, SearchBox } from "react-instantsearch";
import { LocationHit } from "./components/custom-hits";

export { loader } from "./loader";
export { meta } from "./meta";

export function LocationSinglePage() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, campusName } =
    useLoaderData<LoaderReturnType>();
  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <div>
      <InstantSearch
        indexName="dev_Locations"
        searchClient={searchClient}
        initialUiState={{
          dev_Locations: {
            query: `${campusName}`,
          },
        }}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        key={campusName}
      >
        <Configure
          hitsPerPage={1}
          queryType="prefixNone"
          removeWordsIfNoResults="none"
          typoTolerance={false}
          exactOnSingleWordQuery="word"
        />
        <SearchBox
          classNames={{
            root: "opacity-0 size-0 absolute",
          }}
          defaultValue={campusName}
        />
        <LocationHit />
      </InstantSearch>
    </div>
  );
}
