import { Stats } from "react-instantsearch";

import { Button } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";

interface FiltersFooterProps {
  onHide: () => void;
  onClearAll: () => void;
  /** When true, Clear All / Cancel does nothing and appears disabled. */
  clearAllDisabled?: boolean;
}

export const FiltersFooter = ({
  onHide,
  onClearAll,
  clearAllDisabled = false,
}: FiltersFooterProps) => {
  return (
    <div className="mt-auto md:mt-0 flex justify-between md:justify-end items-center gap-4 px-4 py-4 w-full">
      <button
        type="button"
        disabled={clearAllDisabled}
        className={cn(
          "font-semibold text-base transition-colors duration-300 text-left",
          clearAllDisabled
            ? "cursor-not-allowed text-neutral-400 opacity-60"
            : "cursor-pointer text-text-secondary hover:text-ocean md:text-black",
        )}
        onClick={() => {
          if (clearAllDisabled) return;
          onClearAll();
          onHide();
        }}
      >
        <span className="hidden md:block">Cancel</span>
        <span className="md:hidden">Clear All</span>
      </button>
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
