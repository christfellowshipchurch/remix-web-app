import { SearchBox } from "react-instantsearch";

import { useEffect, useState } from "react";
import { useSearchBox } from "react-instantsearch";
import { cn, isValidZip } from "~/lib/utils";
import Icon from "~/primitives/icon";

export const SearchBar = ({
  onSearchStateChange,
  onSearchSubmit,
}: {
  onSearchStateChange: (isSearching: boolean) => void;
  onSearchSubmit: (query: string | null) => void;
}) => {
  const { query, refine } = useSearchBox();
  const [zipCode, setZipCode] = useState<string | null>(null);

  useEffect(() => {
    if (query.length === 5 && isValidZip(query)) {
      onSearchStateChange(true);
      setZipCode(query);
    } else if (zipCode) {
      onSearchStateChange(true);
    } else {
      onSearchStateChange(!!query);
    }
  }, [query, onSearchStateChange]);

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
        "flex w-full items-center gap-4 rounded-full p-1",
        query ? "bg-gray" : "bg-white"
      )}
    >
      <button
        type="submit"
        className="flex items-center justify-center p-2 bg-dark-navy rounded-full relative"
      >
        <Icon
          name="search"
          size={20}
          className={`text-white cursor-pointer relative right-[1px] bottom-[1px]`}
        />
      </button>

      <SearchBox
        placeholder="Search by zip code"
        classNames={{
          root: "flex-grow w-full",
          form: "flex",
          input: `w-full justify-center text-black px-3 outline-none appearance-none`,
          reset: "hidden",
          loadingIndicator: "hidden",
          resetIcon: "hidden",
          submit: "hidden",
        }}
      />
    </div>
  );
};
