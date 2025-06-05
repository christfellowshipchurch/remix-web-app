import { SearchBox, useInstantSearch, useSearchBox } from "react-instantsearch";

import { Hits } from "react-instantsearch";
import {
  HitComponent,
  CampusHit,
} from "~/routes/home/components/location-search/location-hit";
import { Hit } from "algoliasearch";
import { cn, isValidZip } from "~/lib/utils";
import Icon from "~/primitives/icon";
import { useEffect, useState } from "react";

// Create a component to track search state
export function GroupsSearchPopup({
  setIsOpen,
  setSelectedLocation,
  isOpen,
  onSearchSubmit,
}: {
  setIsOpen: (isOpen: boolean) => void;
  setSelectedLocation: (location: string | null) => void;
  isOpen: boolean;
  onSearchSubmit: (query: string | null) => void;
}) {
  const { setIndexUiState } = useInstantSearch();

  const { query, refine } = useSearchBox();
  const [zipCode, setZipCode] = useState<string | null>(null);
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {
        ...prevState.refinementList,
        campusName: [location],
      },
    }));
    setIsOpen(false);
  };

  useEffect(() => {
    if (query.length === 5 && isValidZip(query)) {
      setZipCode(query);
    }
  }, [query]);

  // When the zip code is set, search for it and clear the query so the query doesn't interfere with the geo search
  useEffect(() => {
    if (zipCode) {
      onSearchSubmit(zipCode);
      refine("");
    }
  }, [zipCode]);

  return (
    <div
      className={cn(
        "w-[300px] absolute top-16 -left-4 pt-2 bg-white z-3 rounded-b-[8px] shadow-xl",
        isOpen ? "block" : "hidden"
      )}
    >
      {/* Search Box */}
      <div className="flex gap-3 w-full pb-4 shadow-md px-4">
        <div
          onClick={() => {
            setIsOpen(false);
            refine("");
          }}
          className="cursor-pointer flex items-center justify-center"
        >
          <Icon name="arrowBack" />
        </div>
        <SearchBox
          placeholder="Zip code or location"
          translations={{
            submitButtonTitle: "Search",
            resetButtonTitle: "Reset",
          }}
          classNames={{
            root: "flex-grow",
            form: "flex",
            input:
              "w-full text-xl px-2 focus:outline-none rounded-[8px] bg-[#EDF3F8] px-4 py-2 flex h-full",
            resetIcon: "hidden",
            submit: "hidden",
          }}
        />
      </div>

      {/* Hits */}
      <div className="w-full pt-4 z-4 overflow-hidden min-h-[332px] px-4">
        <Hits
          classNames={{
            root: "flex flex-col overflow-y-auto max-h-[300px]",
            item: "flex w-full rounded-xl transition-transform duration-300 border-[1px] border-[#E8E8E8] [&:first-child]:!border-navy hover:border-navy",
            list: "flex flex-col gap-3",
          }}
          hitComponent={({ hit }) => {
            if (hit?.campusUrl) {
              return (
                <HitComponent
                  hit={hit as unknown as Hit<CampusHit>}
                  redirect={false}
                  setSelectedLocation={handleLocationSelect}
                />
              );
            }
            return null;
          }}
        />
      </div>
    </div>
  );
}
