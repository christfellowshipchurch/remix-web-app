import { Hits } from "react-instantsearch";
import { HitComponent, CampusHit } from "./hit.component";
import { Hit } from "algoliasearch";

export const SearchPopup = () => {
  return (
    <div className="w-full py-4 z-4 overflow-hidden min-h-[332px]">
      {/* Search Results */}
      <div className="space-y-4">
        <Hits
          classNames={{
            root: "flex flex-col overflow-y-auto max-h-[300px]",
            item: "flex w-full rounded-xl transition-transform duration-300 border-[1px] border-[#E8E8E8] [&:first-child]:!border-navy hover:border-navy",
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
