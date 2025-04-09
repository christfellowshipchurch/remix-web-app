import Icon from "~/primitives/icon";
import {
  useClearRefinements,
  UseClearRefinementsProps,
} from "react-instantsearch";

export const SearchCustomClearRefinements = ({}: UseClearRefinementsProps) => {
  const { refine, canRefine } = useClearRefinements();

  return (
    <button onClick={() => canRefine && refine()} className="opacity-40">
      <Icon name="x" size={20} />
    </button>
  );
};
