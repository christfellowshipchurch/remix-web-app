import { useHits } from "react-instantsearch";
import { GroupSingleContent, GroupNotFound } from "../group-single-page";
import { GroupType } from "../../group-finder/types";

export const CustomHits = () => {
  const { items } = useHits<GroupType>();

  return (
    <div className="w-full">
      {items.length > 0 ? (
        items.map((hit: GroupType, index: number) => (
          <GroupSingleContent key={index} hit={hit} />
        ))
      ) : (
        <GroupNotFound />
      )}
    </div>
  );
};
