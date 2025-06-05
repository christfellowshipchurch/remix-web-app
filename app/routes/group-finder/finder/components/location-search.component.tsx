import Icon from "~/primitives/icon";

import { InstantSearch, Configure } from "react-instantsearch";
import { algoliasearch, SearchClient } from "algoliasearch";
import { useFetcher, useLoaderData } from "react-router";
import { emptySearchClient } from "~/routes/search/route";
import { globalSearchClient } from "~/routes/search/route";
import { LoaderReturnType } from "~/routes/group-finder/loader";
import { useEffect, useState } from "react";
import { GroupsSearchPopup } from "./groups-search-popup.component";

export const GroupsLocationSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_API_KEY) {
    return null;
  }
  let newSearchClient: SearchClient | null = globalSearchClient;
  // Create or retrieve the Algolia client
  useEffect(() => {
    if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY && !globalSearchClient) {
      newSearchClient = algoliasearch(
        ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY,
        {}
      );
    }
  }, [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]);

  const searchClient =
    globalSearchClient ||
    (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY
      ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {})
      : emptySearchClient);

  const geocodeFetcher = useFetcher();

  const handleSearch = (query: string | null) => {
    if (!query) {
      setCoordinates(null);
      return;
    }
    const formData = new FormData();
    formData.append("address", query);
    geocodeFetcher.submit(formData, {
      method: "post",
      action: "/google-geocode",
    });
  };

  useEffect(() => {
    if (geocodeFetcher.data?.results?.[0]?.geometry?.location) {
      const { lat, lng } = geocodeFetcher.data.results[0].geometry.location;
      setCoordinates({ lat, lng });
    }
  }, [geocodeFetcher.data]);

  return (
    <div className="flex relative w-[266px]">
      <InstantSearch
        indexName="dev_Locations"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        {coordinates?.lat && coordinates?.lng ? (
          <Configure
            hitsPerPage={20}
            aroundLatLng={`${coordinates.lat}, ${coordinates.lng}`}
            aroundRadius="all"
            aroundLatLngViaIP={false}
            getRankingInfo={true}
          />
        ) : (
          <Configure hitsPerPage={20} />
        )}
        {/* Group Search Box */}
        <div
          className="w-full md:w-[266px] flex items-center rounded-[8px] bg-[#EDF3F8] focus-within:border-ocean py-2 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Icon name="mapFilled" className="text-[#666666] ml-3" />
          <div className="w-full text-xl px-2 focus:outline-none text-text-secondary">
            {selectedLocation || "Location"}
          </div>
        </div>

        {/* Search Popup */}
        <GroupsSearchPopup
          setIsOpen={setIsOpen}
          setSelectedLocation={setSelectedLocation}
          isOpen={isOpen}
          onSearchSubmit={handleSearch}
        />
      </InstantSearch>
    </div>
  );
};
