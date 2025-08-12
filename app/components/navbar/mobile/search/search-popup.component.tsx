import { Hits, useCurrentRefinements, useSearchBox } from "react-instantsearch";
import { PopularSearches } from "./popular-searches.component";
import {
  MobileContentHit,
  MobileContentHitType,
} from "./mobile-content-hit.component";

export const SearchPopup = ({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) => {
  const { query } = useSearchBox();
  const { items } = useCurrentRefinements();
  const isSearching = query.trim().length > 0 || items.length > 0;

  return (
    <div className="size-full p-4 !pt-0 md:p-6 md:!pt-6">
      {/* Search Results */}
      <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
        {isSearching ? (
          <Hits
            onClick={() => setIsSearchOpen(false)}
            classNames={{
              item: "flex",
              list: "grid md:grid-cols-1 gap-4",
            }}
            hitComponent={({ hit }) => {
              const contentData: MobileContentHitType = {
                routing: hit.routing,
                coverImage: hit.coverImage,
                title: hit.title,
                contentType: hit.contentType,
                summary: hit.summary,
              };
              return <MobileContentHit hit={contentData} />;
            }}
          />
        ) : (
          <PopularSearches />
        )}
      </div>
    </div>
  );
};
