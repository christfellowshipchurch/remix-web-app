import { Configure, SearchBox } from "react-instantsearch";
import { CustomHits } from "./custom-hits.component";

export const SearchWrapper = ({ groupName }: { groupName: string }) => {
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
        defaultValue={groupName}
      />
      <CustomHits />
    </>
  );
};
