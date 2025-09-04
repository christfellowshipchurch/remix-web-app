import { Hits } from "react-instantsearch";
import { ContentHit, ContentHitType } from "./content-hit.component";
import { SearchCustomRefinementList } from "./custom-refinements.component";

export const SearchPopup = ({
  setIsSearchOpen,
  query,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
  query?: string;
}) => {
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

      {/* Search Results */}
      <div className="mt-2 space-y-4">
        <Hits
          onClick={() => setIsSearchOpen(false)}
          classNames={{
            // show scrollbar always on overflow
            root: "flex flex-col overflow-y-scroll max-h-[300px] scrollbar-thin [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#666666]/60 [&::-webkit-scrollbar-track]:bg-gray",
            item: "flex w-full",
            list: "flex flex-col",
          }}
          hitComponent={({ hit }) => {
            if (hit?.routing?.pathname) {
              const contentData: ContentHitType = {
                routing: hit.routing || { pathname: hit.url || "" },
                title: hit.title,
                contentType: hit.contentType,
              };
              return <ContentHit hit={contentData} query={query || null} />;
            }
            return null;
          }}
        />
      </div>
    </div>
  );
};
