import { Stats } from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";

interface FiltersHeaderProps {
  onHide: () => void;
}

export const FiltersHeader = ({ onHide }: FiltersHeaderProps) => {
  return (
    <div className="flex justify-between p-4 border-b border-neutral-lighter mb-4">
      <p className="font-bold text-xl">Filters</p>
      <div className="flex gap-2 w-fit cursor-pointer" onClick={onHide}>
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
        <Icon name="x" />
      </div>
    </div>
  );
};
