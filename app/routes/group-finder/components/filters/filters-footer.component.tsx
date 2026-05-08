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
      <Button
        intent="primary"
        className={cn(
          "min-h-0 w-fit min-w-0 shrink-0 rounded-full px-4 py-1 text-base font-semibold",
          "max-md:whitespace-normal",
        )}
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
  );
};
