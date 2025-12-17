import { SearchClient } from "algoliasearch";
import { useState, useEffect, useCallback } from "react";
import { useHits, useInstantSearch } from "react-instantsearch";
import { ContentHit } from "./content-hit.component";
import { SearchCustomRefinementList } from "./custom-refinements.component";
import { ContentItemHit } from "~/routes/search/types";

interface LocationHit {
  campusName?: string;
  campusUrl?: string;
  campusImage?: string;
  objectID?: string;
}

const ContentItemsHitsCollector = ({
  onHitsChange,
}: {
  onHitsChange: (hits: ContentItemHit[]) => void;
}) => {
  const { items } = useHits<ContentItemHit>();

  useEffect(() => {
    onHitsChange(items);
  }, [items, onHitsChange]);

  return null;
};

export const SearchPopup = ({
  setIsSearchOpen,
  query,
  searchClient,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
  query?: string;
  searchClient?: SearchClient | { search: () => Promise<unknown> };
}) => {
  const { indexUiState } = useInstantSearch();
  const [contentHits, setContentHits] = useState<ContentItemHit[]>([]);
  const [locationHits, setLocationHits] = useState<ContentItemHit[]>([]);

  const selectedItems =
    (indexUiState?.refinementList?.contentType as string[]) || [];
  const isPagesSelected =
    selectedItems.includes("Ministry Page") ||
    selectedItems.includes("Page Builder");

  const hasQuery = query && query.trim().length > 0;
  const shouldShowLocations = hasQuery || isPagesSelected;

  // Direct search for locations - bypasses InstantSearch refinements
  const searchLocations = useCallback(
    async (searchQuery: string) => {
      if (!searchClient) {
        setLocationHits([]);
        return;
      }

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
              hitsPerPage: 10,
            },
          ],
        });

        // Extract hits from the first result
        const firstResult = response.results[0];
        const hits =
          "hits" in firstResult ? (firstResult.hits as LocationHit[]) : [];

        const transformedHits: ContentItemHit[] = hits
          .filter((hit) => hit?.campusName)
          .map((hit) => ({
            title: hit.campusName || "",
            contentType: "Location Page",
            url: hit.campusUrl || "",
            routing: {
              pathname: hit.campusUrl || "",
            },
            summary: "",
            rockItemId: 0,
            author: {
              firstName: "",
              lastName: "",
              profileImage: "",
            },
            priority: 0,
            action: "",
            imageLabel: "",
            sermonPrimaryCategories: [],
            sermonSecondaryCategories: [],
            articlePrimaryCategories: [],
            articleSecondaryCategories: [],
            articleReadTime: 0,
            startDateTime: "",
            coverImage: {
              sources: hit.campusImage ? [{ uri: hit.campusImage }] : [],
            },
            _typename: "",
            objectID: hit.objectID || "",
            _highlightResult: {
              title: {
                value: hit.campusName || "",
                matchLevel: "none",
                matchedWords: [],
              },
              summary: {
                value: "",
                matchLevel: "none",
                matchedWords: [],
              },
              author: {
                firstName: {
                  value: "",
                  matchLevel: "none",
                  matchedWords: [],
                },
                lastName: {
                  value: "",
                  matchLevel: "none",
                  matchedWords: [],
                },
              },
              routing: {
                pathname: {
                  value: hit.campusUrl || "",
                  matchLevel: "none",
                  matchedWords: [],
                },
              },
              htmlContent: [],
            },
            __position: 0,
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
      searchLocations(query || "");
    } else {
      setLocationHits([]);
    }
  }, [query, shouldShowLocations, searchLocations]);

  const combinedHits = shouldShowLocations
    ? [...contentHits, ...locationHits]
    : contentHits;

  return (
    <div className="absolute left-0 top-[52px] w-full bg-gray rounded-b-lg shadow-lg px-12 z-4 popup-search-container transition-all duration-800 ease-in-out max-h-0 overflow-hidden">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xs text-[#2F2F2F] opacity-50 font-semibold">
            I'M LOOKING FOR
          </h2>
          <SearchCustomRefinementList attribute="contentType" />
        </div>
      </div>

      {/* Content collector to receive search updates */}
      <ContentItemsHitsCollector onHitsChange={setContentHits} />

      <div className="mt-2 space-y-4">
        <div className="flex flex-col overflow-y-scroll max-h-[300px] scrollbar-thin [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#666666]/60 [&::-webkit-scrollbar-track]:bg-gray">
          {combinedHits.map((hit) => (
            <div
              key={hit.objectID}
              onClick={() => setIsSearchOpen(false)}
              className="flex w-full"
            >
              <ContentHit hit={hit} query={query || null} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
