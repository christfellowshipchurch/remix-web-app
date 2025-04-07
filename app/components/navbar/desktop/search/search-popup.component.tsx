import { Hits, useSearchBox } from "react-instantsearch";
import { HitComponent, HitProps } from "./hit-component.component";
import { SearchCustomRefinementList } from "./search.component";
import type { Hit as AlgoliaHit } from "instantsearch.js";

export const SearchPopup = ({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) => {
  const { query } = useSearchBox();
  // Track if user is searching (has entered text)
  const isSearching = query.trim().length > 0;

  return (
    <div className="absolute left-0 top-[52px] w-full bg-[#F3F5FA] rounded-b-lg shadow-lg px-12 py-4 z-4">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xs text-[#2F2F2F] opacity-50 font-semibold">
            I'M LOOKING FOR
          </h2>
          <SearchCustomRefinementList attribute="contentType" />
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-2 space-y-4">
        <Hits
          onClick={(e) => {
            // Prevent event propagation to ensure click is handled properly
            e.stopPropagation();
            setIsSearchOpen(false);
          }}
          classNames={{
            item: "flex",
            list: "grid md:grid-cols-1 gap-4",
          }}
          hitComponent={({ hit, sendEvent }) => (
            <HitComponent
              hit={hit as unknown as AlgoliaHit<HitProps>}
              sendEvent={sendEvent}
            />
          )}
        />
      </div>
    </div>
  );
};
