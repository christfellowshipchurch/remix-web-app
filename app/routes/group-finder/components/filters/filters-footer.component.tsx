import { Stats } from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";

interface FiltersFooterProps {
  onHide: () => void;
  onClearAll: () => void;
}

export const FiltersFooter = ({ onHide, onClearAll }: FiltersFooterProps) => {
  return (
    <div className="flex justify-between md:justify-end items-center gap-4 px-4 py-4 border-t border-black w-full">
      <div
        className="cursor-pointer text-text-secondary hover:text-ocean transition-colors duration-300"
        onClick={() => {
          onClearAll();
          onHide();
        }}
      >
        <span className="hidden md:block font-semibold text-base text-black">
          Cancel
        </span>
        <span className="md:hidden">Clear All</span>
      </div>
      <div className="hidden md:block">
        <Button
          intent="primary"
          className="w-fit px-4 py-1 min-w-0 min-h-0 rounded-full font-semibold text-base"
          onClick={() => onHide()}
        >
          <Stats
            classNames={{
              root: "",
            }}
            translations={{
              rootElementText: ({ nbHits }) =>
                `Show ${nbHits.toLocaleString()} Results`,
            }}
          />
        </Button>
      </div>
      <div className="md:hidden">
        <Button
          intent="primary"
          className="w-fit font-normal text-base"
          onClick={onHide}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
