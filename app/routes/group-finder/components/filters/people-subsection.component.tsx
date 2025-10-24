import React from "react";
import { useRefinementList } from "react-instantsearch";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";

interface PeopleSubsectionProps {
  attribute: string;
  onItemsChange?: (hasItems: boolean) => void;
}

export const PeopleSubsection = ({
  attribute,
  onItemsChange,
}: PeopleSubsectionProps) => {
  const { items, refine } = useRefinementList({ attribute });
  const buttonStyles =
    "min-w-0 min-h-0 px-2 py-[6px] text-sm font-semibold text-black border border-neutral-light hover:border-ocean hover:bg-ocean hover:text-white transition-all duration-300 rounded-[5px]";
  const buttonRefinedStyle =
    "bg-ocean text-white border-ocean hover:!bg-navy hover:!border-navy";

  // Notify parent about items availability
  React.useEffect(() => {
    onItemsChange?.(items.length > 0);
  }, [items.length, onItemsChange]);

  return (
    <div className="flex flex-wrap gap-y-2 gap-x-2">
      {items.map((item, index) => (
        <div key={index}>
          <Button
            intent="secondary"
            className={cn(buttonStyles, item.isRefined && buttonRefinedStyle)}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              refine(item.value);
            }}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </div>
  );
};
