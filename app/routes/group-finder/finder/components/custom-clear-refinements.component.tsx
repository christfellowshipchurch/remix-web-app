import {
  useClearRefinements,
  UseClearRefinementsProps,
} from "react-instantsearch";
import Icon from "~/primitives/icon";

interface CustomClearRefinementsProps extends UseClearRefinementsProps {
  text?: string;
}

export const CustomClearRefinements = ({
  text,
  ...props
}: CustomClearRefinementsProps) => {
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
        {text || "Clear all"}
      </p>
      <Icon name="x" size={24} color={!canRefine ? "#B4B4B4" : "black"} />
    </div>
  );
};
