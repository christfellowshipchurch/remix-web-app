import { Hits } from "react-instantsearch";
import { HitComponent, CampusHit } from "./hit.component";
import { Hit } from "algoliasearch";

export const SearchPopup = () => {
  return (
    <div className="w-full py-4 z-4 popup-search-container overflow-hidden min-h-[332px]">
      {/* Search Results */}
      <div className="space-y-4">
        <Hits
          classNames={{
            root: "flex flex-col overflow-y-auto max-h-[300px]",
            item: "flex w-full",
            list: "flex flex-col gap-3",
          }}
          hitComponent={({ hit }) => {
            if (hit?.campusUrl) {
              return <HitComponent hit={hit as unknown as Hit<CampusHit>} />;
            }
            return null;
          }}
        />
      </div>
    </div>
  );
};
