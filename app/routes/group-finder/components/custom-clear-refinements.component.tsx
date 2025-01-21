import {
  useClearRefinements,
  UseClearRefinementsProps,
} from "react-instantsearch";
import Icon from "~/primitives/icon";

export const CustomClearRefinements = (props: UseClearRefinementsProps) => {
  const { refine, canRefine } = useClearRefinements(props);

  return (
    <div
      className={`flex gap-2 ${canRefine ? "cursor-pointer" : ""}`}
      onClick={() => refine()}
    >
      <p
        className={`${
          !canRefine ? "text-[#B4B4B4]" : "text-primary"
        } text-lg font-medium w-fit`}
      >
        Clear all
      </p>
      <Icon name="x" size={24} color={!canRefine ? "#B4B4B4" : "black"} />
    </div>
  );
};
