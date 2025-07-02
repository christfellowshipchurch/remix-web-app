import Icon from "~/primitives/icon";
import {
  useClearRefinements,
} from "react-instantsearch";

export const SearchCustomClearRefinements = () => {
  const { refine, canRefine } = useClearRefinements();

  return (
    <button onClick={() => canRefine && refine()} className="opacity-40">
      <Icon name="x" size={20} />
    </button>
  );
};
