import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useSearchBox } from "react-instantsearch";

import { cn, isValidZip } from "~/lib/utils";
import Icon from "~/primitives/icon";

export const SearchBar = ({
  onSearchStateChange,
  onSearchSubmit,
  "data-gtm": dataGtm,
}: {
  onSearchStateChange: (isSearching: boolean) => void;
  onSearchSubmit: (query: string | null) => void;
  "data-gtm"?: string;
}) => {
  const { refine } = useSearchBox();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refine("");
  }, [refine]);

  const syncFromInput = (raw: string) => {
    setInputValue(raw);
    refine("");

    const trimmed = raw.trim();
    if (trimmed.length === 5 && isValidZip(trimmed)) {
      onSearchStateChange(true);
      onSearchSubmit(trimmed);
    } else {
      onSearchSubmit(null);
      onSearchStateChange(!!raw.trim());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    syncFromInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    refine("");
    if (trimmed.length === 5 && isValidZip(trimmed)) {
      onSearchStateChange(true);
      onSearchSubmit(trimmed);
    } else {
      onSearchSubmit(null);
      onSearchStateChange(!!trimmed);
    }
    inputRef.current?.blur();
  };

  return (
    <form
      className={cn(
        "flex w-full items-center gap-4 rounded-full p-1",
        inputValue ? "bg-gray" : "bg-white",
      )}
      data-gtm={dataGtm}
      onSubmit={handleSubmit}
    >
      <button
        type="submit"
        className="flex items-center justify-center p-2 bg-ocean lg:bg-dark-navy rounded-full relative"
        aria-label="Search by zip code"
      >
        <Icon
          name="search"
          size={20}
          className={`text-white cursor-pointer relative right-px bottom-px`}
        />
      </button>

      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="postal-code"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search by zip code"
        className="w-full grow justify-center text-black px-3 outline-none appearance-none bg-transparent"
        aria-label="Zip code"
      />
    </form>
  );
};
