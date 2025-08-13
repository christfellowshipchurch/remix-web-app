import { useLoaderData } from "react-router-dom";
import { useMemo } from "react";
import { createSearchClient } from "../../messages/all-messages/components/all-messages.component";

import { Configure, InstantSearch, SearchBox } from "react-instantsearch";
import { LocationPageHit } from "./components/custom-location-hit";
import { LoaderReturnType } from "./loader";

export function LocationSinglePage() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, campusUrl } =
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
            query: `${campusUrl}`,
          },
        }}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        key={campusUrl}
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
          defaultValue={campusUrl}
        />
        <LocationPageHit />
      </InstantSearch>
    </div>
  );
}
