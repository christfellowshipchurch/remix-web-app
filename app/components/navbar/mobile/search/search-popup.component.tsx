import { Hits } from "react-instantsearch";
import { MobileSearchCustomRefinementList } from "./customRefinements.component";
import { PopularSearches } from "./popular-searches.component";
import { HitComponent } from "./hit-component.component";

export const SearchPopup = () => {
  const areHitsEmpty = true;
  return (
    <div className="w-full p-4 md:p-6">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-2 w-full">
          <MobileSearchCustomRefinementList attribute="contentType" />
        </div>
      </div>

      {/* Search Results */}
      <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
        {areHitsEmpty ? (
          <PopularSearches />
        ) : (
          <Hits
            classNames={{
              item: "flex",
              list: "grid md:grid-cols-1 gap-4",
            }}
            hitComponent={HitComponent}
          />
        )}
      </div>
    </div>
  );
};
