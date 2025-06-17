import { useHits } from "react-instantsearch";
import { ClassSingleContent, ClassNotFound } from "../class-single-page";
import { GroupHit } from "../../types";

export const CustomHits = () => {
  const { items } = useHits<GroupHit>();

  return (
    <div className="w-full">
      {items.length > 0 ? (
        items.map((hit) => (
          <ClassSingleContent key={hit.objectID} hit={hit as GroupHit} />
        ))
      ) : (
        <ClassNotFound />
      )}
    </div>
  );
};
