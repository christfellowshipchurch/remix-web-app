import { ReactNode, useState } from "react";
import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { GroupsCustomRefinement } from "~/routes/group-finder/components/popups/groups-custom-refinement.component";

export function UpcomingSessionFilters() {
  const [showGroupType, setShowGroupType] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);

  const onHide = () => {
    setShowGroupType(false);
    setShowFrequency(false);
  };

  const handleToggle = (
    setter: (value: boolean) => void,
    currentValue: boolean
  ) => {
    onHide();
    setter(!currentValue);
  };

  return (
    <FilterContainer>
      {/* Learning Format */}
      <FilterDropdown
        title="Learning Format"
        isOpen={showGroupType}
        onToggle={() => handleToggle(setShowGroupType, showGroupType)}
        onHide={onHide}
        data={{
          content: [{ attribute: "meetingType", isMeetingType: true }],
        }}
        maxWidth={210}
        refinementClassName="pb-4"
      />

      {/* Languages */}
      <FilterDropdown
        title="Languages"
        isOpen={showFrequency}
        onToggle={() => handleToggle(setShowFrequency, showFrequency)}
        onHide={onHide}
        data={{
          content: [
            {
              attribute: "meetingDay",
              checkbox: true,
              showFooter: true,
            },
          ],
        }}
      />
    </FilterContainer>
  );
}

interface FilterContainerProps {
  children: ReactNode;
}

export function FilterContainer({ children }: FilterContainerProps) {
  return (
    <div className="relative md:static flex gap-4 w-full bg-white col-span-1 h-full min-w-[300px] items-center">
      <div className="w-full md:w-fit flex gap-4">{children}</div>
    </div>
  );
}

interface FilterDropdownProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onHide: () => void;
  data: {
    content: Array<{
      attribute: string;
      isMeetingType?: boolean;
      checkbox?: boolean;
      showFooter?: boolean;
    }>;
  };
  maxWidth?: number;
  refinementClassName?: string;
}

export function FilterDropdown({
  title,
  isOpen,
  onToggle,
  onHide,
  data,
  maxWidth = 210,
  refinementClassName,
}: FilterDropdownProps) {
  return (
    <div
      className={cn(
        "md:relative",
        "flex items-center justify-between",
        "w-fit",
        "rounded-[8px]",
        "p-3",
        "border border-[#666666]",
        "text-text-secondary",
        "font-semibold",
        "cursor-pointer"
      )}
      style={{ maxWidth: maxWidth }}
      onClick={onToggle}
    >
      <p>{title}</p>
      <Icon name="chevronDown" />

      <GroupsCustomRefinement
        popupTitle={title}
        data={data}
        onHide={onHide}
        showSection={isOpen}
        className={`${refinementClassName} !w-[90vw] md:!w-[330px] left-0 translate-x-0 md:left-auto md:right-1/2 md:translate-x-1/2`}
      />
    </div>
  );
}
