import { useLoaderData } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";

import { Configure, Hits, InstantSearch } from "react-instantsearch";
import { LoaderReturnType } from "./loader";
import { LocationSingle } from "./partials/location-content";
import { createSearchClient } from "~/lib/create-search-client";

export function LocationSinglePage() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, campusUrl } =
    useLoaderData<LoaderReturnType>();
  const [isVisible, setIsVisible] = useState(false);

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  useEffect(() => {
    // Small delay to ensure the component is mounted before starting animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isVisible ? "animate-fadeIn duration-400" : "opacity-0"
      }`}
    >
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
