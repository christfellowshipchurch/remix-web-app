import { Configure, SearchBox } from "react-instantsearch";
import { CustomHits } from "./custom-hits.component";

// Name of Class
export const SearchWrapper = ({ className }: { className: string }) => {
  return (
    <>
      <Configure
        hitsPerPage={1}
        queryType="prefixNone"
        removeWordsIfNoResults="none"
        typoTolerance={false}
        exactOnSingleWordQuery="word"
      />
      <SearchBox
        classNames={{
          root: "opacity-0 size-0 absolute",
        }}
        defaultValue={className}
      />
      <CustomHits />
    </>
  );
};
