import { SearchClient } from "algoliasearch";
import { useState, useEffect, useCallback } from "react";
import {
  useCurrentRefinements,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { PopularSearches } from "./popular-searches.component";
import {
  MobileContentHit,
  MobileContentHitType,
} from "./mobile-content-hit.component";

interface LocationHit {
  campusName?: string;
  campusUrl?: string;
  campusImage?: string;
}

const ContentItemsHitsCollector = ({
  onHitsChange,
}: {
  onHitsChange: (hits: MobileContentHitType[]) => void;
}) => {
  const { items } = useHits<Record<string, unknown>>();

  useEffect(() => {
    const contentHits: MobileContentHitType[] = items.map((hit) => ({
      routing: {
        pathname:
          (hit.routing as { pathname?: string })?.pathname ||
          (hit.url as string) ||
          "",
      },
      coverImage:
        (hit.coverImage as MobileContentHitType["coverImage"]) || null,
      title: (hit.title as string) || "",
      contentType: (hit.contentType as string) || "",
      summary: (hit.summary as string) || "",
    }));

    onHitsChange(contentHits);
  }, [items, onHitsChange]);

  return null;
};

export const SearchPopup = ({
  setIsSearchOpen,
  searchClient,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
  searchClient: SearchClient | { search: () => Promise<unknown> };
}) => {
  const { query } = useSearchBox();
  const { items } = useCurrentRefinements();
  const { indexUiState } = useInstantSearch();
  const [contentHits, setContentHits] = useState<MobileContentHitType[]>([]);
  const [locationHits, setLocationHits] = useState<MobileContentHitType[]>([]);

  const selectedItems =
    (indexUiState?.refinementList?.contentType as string[]) || [];
  const isPagesSelected =
    selectedItems.includes("Ministry Page") ||
    selectedItems.includes("Page Builder");

  const isSearching =
    query.trim().length > 0 || items.length > 0 || isPagesSelected;

  const hasQuery = query.trim().length > 0;
  const shouldShowLocations = isPagesSelected || hasQuery;

  // Direct search for locations - bypasses InstantSearch refinements
  const searchLocations = useCallback(
    async (searchQuery: string) => {
      try {
        // Check if this is the real Algolia client (has transporter property)
        if (!("transporter" in searchClient)) {
          // Using the empty search client, return empty results
          setLocationHits([]);
          return;
        }

        // Use the Algolia v5 search method with the correct format
        const response = await (
          searchClient as SearchClient
        ).search<LocationHit>({
          requests: [
            {
              indexName: "dev_Locations",
              query: searchQuery,
              hitsPerPage: 9,
            },
          ],
        });

        // Extract hits from the first result
        const firstResult = response.results[0];
        const hits =
          "hits" in firstResult ? (firstResult.hits as LocationHit[]) : [];

        const transformedHits: MobileContentHitType[] = hits
          .filter((hit) => hit?.campusName)
          .map((hit) => ({
            routing: {
              pathname: `locations/${hit.campusUrl || ""}`,
            },
            coverImage: hit.campusImage
              ? {
                  sources: [{ uri: hit.campusImage }],
                }
              : null,
            title: hit.campusName || "",
            contentType: "Location Page",
            summary: "",
          }));

        setLocationHits(transformedHits);
      } catch (error) {
        console.error("Error searching locations:", error);
        setLocationHits([]);
      }
    },
    [searchClient]
  );

  // Search locations when query changes or when Pages is selected
  useEffect(() => {
    if (shouldShowLocations) {
      searchLocations(query);
    } else {
      setLocationHits([]);
    }
  }, [query, shouldShowLocations, searchLocations]);

  const combinedHits = shouldShowLocations
    ? [...contentHits, ...locationHits]
    : contentHits;

  return (
    <div className="size-full p-4 !pt-0 md:p-6 md:!pt-6">
      {/* Always render content collector to receive search updates */}
      <ContentItemsHitsCollector onHitsChange={setContentHits} />

      <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
        {isSearching ? (
          <div className="grid md:grid-cols-1 gap-4">
            {combinedHits.map((hit, index) => (
              <div
                key={`${hit.routing.pathname}-${index}`}
                className="flex"
                onClick={() => setIsSearchOpen(false)}
              >
                <MobileContentHit hit={hit} />
              </div>
            ))}
          </div>
        ) : (
          <PopularSearches />
        )}
      </div>
    </div>
  );
};
