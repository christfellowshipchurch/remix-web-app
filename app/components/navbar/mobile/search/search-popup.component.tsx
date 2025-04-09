import { Hits, useCurrentRefinements, useSearchBox } from "react-instantsearch";
import { MobileSearchCustomRefinementList } from "./customRefinements.component";
import { PopularSearches } from "./popular-searches.component";
import { HitComponent } from "./hit-component.component";

export const SearchPopup = ({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) => {
  const { query } = useSearchBox();
  const { items } = useCurrentRefinements();
  const isSearching = query.trim().length > 0 || items.length > 0;

  return (
    <div className="size-full p-4 md:p-6">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-2 w-full">
          <MobileSearchCustomRefinementList attribute="contentType" />
        </div>
      </div>

      {/* Search Results */}
      <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
        {isSearching ? (
          <Hits
            onClick={() => setIsSearchOpen(false)}
            classNames={{
              item: "flex",
              list: "grid md:grid-cols-1 gap-4",
            }}
            hitComponent={HitComponent}
          />
        ) : (
          <PopularSearches />
        )}
      </div>
    </div>
  );
};
