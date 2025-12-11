import { useState, useEffect } from "react";
import {
  Configure,
  Index,
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

const LocationsHitsCollector = ({
  onHitsChange,
}: {
  onHitsChange: (hits: MobileContentHitType[]) => void;
}) => {
  const { items } = useHits<Record<string, unknown>>();

  useEffect(() => {
    const locationHits: MobileContentHitType[] = items
      .filter((hit) => hit?.campusName)
      .map((hit) => ({
        routing: {
          pathname: (hit.campusUrl as string) || "",
        },
        coverImage: hit.campusImage
          ? {
              sources: [{ uri: hit.campusImage as string }],
            }
          : null,
        title: hit.campusName as string,
        contentType: "Location Page",
        summary: "",
      }));

    onHitsChange(locationHits);
  }, [items, onHitsChange]);

  return null;
};

export const SearchPopup = ({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
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
  const combinedHits = shouldShowLocations
    ? [...contentHits, ...locationHits]
    : contentHits;

  return (
    <div className="size-full p-4 !pt-0 md:p-6 md:!pt-6">
      <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
        {isSearching ? (
          <>
            <Index indexName="dev_contentItems">
              <Configure hitsPerPage={9} />
              <ContentItemsHitsCollector onHitsChange={setContentHits} />
            </Index>

            <Index indexName="dev_Locations">
              <Configure hitsPerPage={9} />
              <LocationsHitsCollector onHitsChange={setLocationHits} />
            </Index>

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
          </>
        ) : (
          <PopularSearches />
        )}
      </div>
    </div>
  );
};
