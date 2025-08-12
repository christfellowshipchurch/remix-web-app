import { useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { GroupsCustomRefinement } from "./groups-custom-refinement.component";
import { AllFiltersPopup } from "./all-filters.component";
import { cn } from "~/lib/utils";

export function DesktopGroupFilters({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) {
  const [showGroupType, setShowGroupType] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const onHide = () => {
    setShowGroupType(false);
    setShowFrequency(false);
    setShowPeople(false);
    setShowAllFilters(false);
    setIsSearchOpen(false);
  };

  return (
    <div className="flex gap-4 w-full bg-white col-span-1 h-full min-w-[300px] items-center">
      <div className="hidden lg:flex gap-4 w-full">
        {/* Group Type */}
        <div
          className="relative flex items-center justify-between w-full max-w-[148px] rounded-[8px] p-3 border border-[#666666] md:w-[900px] text-text-secondary font-semibold cursor-pointer"
          onClick={() => {
            onHide();
            setShowGroupType(!showGroupType);
          }}
        >
          <p>Group Type</p>
          <Icon name="chevronDown" />

          <GroupsCustomRefinement
            title="Group Type"
            data={{
              content: [
                { attribute: "meetingType", isMeetingType: true },
                {
                  attribute: "subPreferences",
                  checkbox: true,
                  showFooter: true,
                },
              ],
            }}
            onHide={onHide}
            showSection={showGroupType}
          />
        </div>
        <div className="hidden xl:flex gap-4">
          {/* Frequency */}
          <div
            className="relative flex items-center justify-between w-full max-w-[148px] rounded-[8px] p-3 border border-[#666666] md:w-[900px] text-text-secondary font-semibold cursor-pointer"
            onClick={() => {
              onHide();
              setShowFrequency(!showFrequency);
            }}
          >
            <p>Frequency</p>
            <Icon name="chevronDown" />

            <GroupsCustomRefinement
              title="Frequency"
              data={{
                content: [
                  {
                    attribute: "meetingDay",
                    checkbox: true,
                    showFooter: true,
                  },
                ],
              }}
              onHide={onHide}
              showSection={showFrequency}
            />
          </div>
          {/* People */}
          <div
            className="relative flex items-center justify-between w-full max-w-[148px] rounded-[8px] p-3 border border-[#666666] md:w-[900px] text-text-secondary font-semibold cursor-pointer"
            onClick={() => {
              onHide();
              setShowPeople(!showPeople);
            }}
          >
            <p>People</p>
            <Icon name="chevronDown" />

            <GroupsCustomRefinement
              title="People"
              data={{
                content: [{ attribute: "preferences", showFooter: true }],
              }}
              onHide={onHide}
              showSection={showPeople}
            />
          </div>
        </div>
      </div>
      <div className="w-full items-center gap-4 h-full hidden md:flex xl:!hidden">
        <div className="w-px h-full bg-text-secondary" />
        <Button
          intent="secondary"
          className="w-full max-w-[150px]"
          onClick={() => {
            onHide();
            setShowAllFilters(!showAllFilters);
            setHasInteracted(true);
          }}
        >
          All filters
        </Button>

        {/* All Filters */}
        <div
          className={cn(
            "absolute right-0 top-[80px] border-t border-neutral-300",
            "size-full max-w-[484px]",
            "hidden md:block",
            hasInteracted
              ? showAllFilters
                ? "animate-slide-in z-1"
                : "animate-slide-out opacity-0 pointer-events-none z-[-1]"
              : showAllFilters
              ? "z-1"
              : "opacity-0 pointer-events-none z-[-1]",
            "transition-all duration-300"
          )}
        >
          <AllFiltersPopup onHide={onHide} />
        </div>
      </div>
    </div>
  );
}
