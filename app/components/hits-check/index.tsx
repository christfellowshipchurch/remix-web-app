import { useEffect } from "react";
import { useHits } from "react-instantsearch";
import { GroupType } from "~/routes/group-finder/types";

export const HitsCheck = ({
  setHits,
}: {
  setHits: (hits: GroupType[]) => void;
}) => {
  const { items } = useHits<GroupType>();

  useEffect(() => {
    setHits(items);
  }, [items]);

  return <></>;
};
