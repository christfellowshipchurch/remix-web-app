import {
  useClearRefinements,
  UseClearRefinementsProps,
} from "react-instantsearch";

export const CustomClearRefinements = (props: UseClearRefinementsProps) => {
  const { refine, hasRefinements } = useClearRefinements(props);

  return (
    <div
      className={`${!hasRefinements ? "hidden" : ""}  cursor-pointer`}
      onClick={() => refine()}
    >
      Clear all
    </div>
  );
};
