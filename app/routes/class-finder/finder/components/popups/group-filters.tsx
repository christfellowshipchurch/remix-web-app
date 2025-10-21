import { useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { ClassesCustomRefinement } from "./classes-custom-refinement.component";
import { AllClassFiltersPopup } from "./all-filters.component";
import { cn } from "~/lib/utils";

export function DesktopClassFilters({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) {
  const [showTopic, setShowTopic] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const onHide = () => {
    setShowTopic(false);

    // TODO: Update to new Filters
    setShowFrequency(false);
    setShowPeople(false);
    setShowAllFilters(false);
    setIsSearchOpen(false);
  };

  const boxStyles =
    "relative flex items-center justify-between w-full max-w-[148px] rounded-[8px] p-3 border border-[#666666] md:w-[900px] text-text-secondary font-semibold cursor-pointer";

  return (
    <div className="flex gap-4 w-full bg-white col-span-1 h-full min-w-[300px] items-center">
      <div className="hidden lg:flex gap-4 w-full">
        {/* Topic */}
        <div
          className={cn(boxStyles)}
          onClick={() => {
            onHide();
            setShowTopic(!showTopic);
          }}
        >
          <p>Topic</p>
          <Icon name="chevronDown" />

          <ClassesCustomRefinement
            title="Topic"
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
            showSection={showTopic}
          />
        </div>
        <div className="hidden xl:flex gap-4">
          {/* Frequency */}
          <div
            className={cn(boxStyles)}
            onClick={() => {
              onHide();
              setShowFrequency(!showFrequency);
            }}
          >
            <p>Frequency</p>
            <Icon name="chevronDown" />

            <ClassesCustomRefinement
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
            className={cn(boxStyles)}
            onClick={() => {
              onHide();
              setShowPeople(!showPeople);
            }}
          >
            <p>People</p>
            <Icon name="chevronDown" />

            <ClassesCustomRefinement
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

      {/* All Filters Button & Popup */}
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
          <AllClassFiltersPopup onHide={onHide} />
        </div>
      </div>
    </div>
  );
}
