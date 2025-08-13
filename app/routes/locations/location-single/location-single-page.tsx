import { useLoaderData } from "react-router-dom";
import { useMemo } from "react";
import { createSearchClient } from "../../messages/all-messages/components/all-messages.component";

import { Configure, Hits, InstantSearch } from "react-instantsearch";
import { LoaderReturnType } from "./loader";
import { LocationSingle } from "./partials/location-content";

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
        key={campusUrl}
      >
        <Configure filters={`campusUrl:"${campusUrl}"`} />
        <Hits hitComponent={LocationSingle} />
      </InstantSearch>
    </div>
  );
}
