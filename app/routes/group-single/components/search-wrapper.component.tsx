import { Configure, SearchBox, useHits } from "react-instantsearch";
import { GroupNotFound, GroupSingleContent } from "../group-single-page";
import { GroupType } from "~/routes/group-finder/types";

export const SearchWrapper = ({ groupName }: { groupName: string }) => {
  const { items } = useHits<GroupType>();

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

      <div className="w-full">
        {items.length > 0 ? (
          items.map((hit: GroupType, index: number) => (
            <GroupSingleContent key={index} hit={hit} />
          ))
        ) : (
          <GroupNotFound />
        )}
      </div>
    </>
  );
};
