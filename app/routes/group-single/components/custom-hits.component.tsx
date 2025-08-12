import { useHits } from "react-instantsearch";
import { GroupSingleContent, GroupNotFound } from "../group-single-page";
import { GroupHit } from "../../group-finder/types";

export const CustomHits = () => {
  const { items } = useHits<GroupHit>();

  return (
    <div className="w-full">
      {items.length > 0 ? (
        items.map((hit) => (
          <GroupSingleContent key={hit.objectID} hit={hit as GroupHit} />
        ))
      ) : (
        <GroupNotFound />
      )}
    </div>
  );
};
