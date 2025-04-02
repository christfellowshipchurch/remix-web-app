import Icon from "~/primitives/icon";
import {
  useClearRefinements,
  UseClearRefinementsProps,
} from "react-instantsearch";

interface CustomClearRefinementsProps extends UseClearRefinementsProps {
  text?: string;
}

export const SearchCustomClearRefinements = ({
  text,
}: CustomClearRefinementsProps) => {
  const { refine, canRefine } = useClearRefinements();

  return (
    <button onClick={() => canRefine && refine()} className="opacity-40">
      <Icon name="x" size={20} />
    </button>
  );
};
