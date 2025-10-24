import { useHits } from "react-instantsearch";
import { ClassSingleContent, ClassNotFound } from "../class-single-page";
import { GroupType } from "~/routes/group-finder/types";

export const CustomHits = () => {
  const { items } = useHits<GroupType>();

  return (
    <div className="w-full">
      {items.length > 0 ? (
        items.map((hit) => (
          <ClassSingleContent
            key={hit.objectID}
            hit={hit as unknown as GroupType}
          />
        ))
      ) : (
        <ClassNotFound />
      )}
    </div>
  );
};
