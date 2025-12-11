import { useState, useEffect } from "react";
import {
  Configure,
  Index,
  useHits,
  useInstantSearch,
} from "react-instantsearch";
import { ContentHit } from "./content-hit.component";
import { SearchCustomRefinementList } from "./custom-refinements.component";
import { ContentItemHit } from "~/routes/search/types";

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

const LocationsHitsCollector = ({
  onHitsChange,
}: {
  onHitsChange: (hits: ContentItemHit[]) => void;
}) => {
  const { items } = useHits<Record<string, unknown>>();

  useEffect(() => {
    const locationHits: ContentItemHit[] = items
      .filter((hit) => hit?.campusName)
      .map((hit) => ({
        title: hit.campusName as string,
        contentType: "Location Page",
        url: (hit.campusUrl as string) || "",
        routing: {
          pathname: (hit.campusUrl as string) || "",
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
          sources: hit.campusImage ? [{ uri: hit.campusImage as string }] : [],
        },
        _typename: "",
        objectID: hit.objectID as string,
        _highlightResult: {
          title: {
            value: hit.campusName as string,
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
              value: (hit.campusUrl as string) || "",
              matchLevel: "none",
              matchedWords: [],
            },
          },
          htmlContent: [],
        },
        __position: 0,
      }));

    onHitsChange(locationHits);
  }, [items, onHitsChange]);

  return null;
};

export const SearchPopup = ({
  setIsSearchOpen,
  query,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
  query?: string;
}) => {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const [contentHits, setContentHits] = useState<ContentItemHit[]>([]);
  const [locationHits, setLocationHits] = useState<ContentItemHit[]>([]);

  const selectedItems =
    (indexUiState?.refinementList?.contentType as string[]) || [];
  const isPagesSelected =
    selectedItems.includes("Ministry Page") ||
    selectedItems.includes("Page Builder");

  useEffect(() => {
    if (isPagesSelected) {
      setIndexUiState((prevState) => {
        return {
          ...prevState,
          dev_Locations: {
            ...(((prevState as Record<string, unknown>).dev_Locations as Record<
              string,
              unknown
            >) || {}),
            refinementList: {},
          },
        } as typeof prevState;
      });
    }
  }, [isPagesSelected, setIndexUiState]);

  const hasQuery = query && query.trim().length > 0;
  const shouldShowLocations = hasQuery || isPagesSelected;
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

      <div className="mt-2 space-y-4">
        <Index indexName="dev_contentItems">
          <Configure hitsPerPage={10} />
          <ContentItemsHitsCollector onHitsChange={setContentHits} />
        </Index>

        <Index indexName="dev_Locations">
          <Configure hitsPerPage={10} />
          <LocationsHitsCollector onHitsChange={setLocationHits} />
        </Index>

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
