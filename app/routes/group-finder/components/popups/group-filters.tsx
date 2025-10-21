import { useState, useRef, useEffect } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { GroupsCustomRefinement } from "./groups-custom-refinement.component";
import { AllFiltersPopup } from "./all-filters.component";
import { cn } from "~/lib/utils";

export function DesktopGroupFilters({
  coordinates,
  setCoordinates,
  ageInput,
  setAgeInput,
}: {
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
  setCoordinates: (
    coordinates: {
      lat: number | null;
      lng: number | null;
    } | null
  ) => void;
  ageInput: string;
  setAgeInput: (age: string) => void;
}) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (dropdownName: string) => {
    if (activeDropdown === dropdownName) {
      // Close if already open
      setActiveDropdown(null);
    } else {
      // Open new dropdown
      setActiveDropdown(dropdownName);
    }
    setHasInteracted(true);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  // Global click-outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeAllDropdowns();
      }
    };

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const boxStyles =
    "relative flex items-center justify-between w-full max-w-[140px] xl:max-w-[148px] rounded-[8px] p-3 border border-[#666666] md:w-[900px] text-text-secondary font-semibold cursor-pointer";

  return (
    <div
      ref={containerRef}
      className="flex gap-4 w-full bg-white col-span-1 h-full min-w-[300px] items-center"
    >
      <div className="hidden lg:flex gap-4 w-full">
        {/* Location Select Box */}
        <div
          className={cn(boxStyles)}
          onClick={() => toggleDropdown("location")}
        >
          <p>Location</p>
          <Icon name="chevronDown" />

          <GroupsCustomRefinement
            popupTitle="Location"
            data={{
              content: [
                {
                  title: "I want to meet...",
                  attribute: "meetingType",
                  isMeetingType: true,
                },
                {
                  title: "Find a group nearby",
                  attribute: "campus",
                  isLocation: true,
                  coordinates: coordinates,
                  setCoordinates: setCoordinates,
                },
              ],
            }}
            onHide={closeAllDropdowns}
            showSection={activeDropdown === "location"}
          />
        </div>

        {/* People */}
        <div className={cn(boxStyles)} onClick={() => toggleDropdown("people")}>
          <p>People</p>
          <Icon name="chevronDown" />

          <GroupsCustomRefinement
            popupTitle="People"
            data={{
              content: [
                {
                  title: "I want to join a group for...",
                  attribute: "groupFor",
                },
                {
                  title: "I want to meet people who are...",
                  attribute: "peopleWhoAre",
                },
                {
                  title: "Age Range",
                  attribute: "minAge",
                  input: true,
                  inputPlaceholder: "Your Age",
                  isAgeRange: true,
                  showFooter: true,
                },
              ],
            }}
            onHide={closeAllDropdowns}
            showSection={activeDropdown === "people"}
            ageInput={ageInput}
            setAgeInput={setAgeInput}
          />
        </div>

        {/* Topics */}
        <div className={cn(boxStyles)} onClick={() => toggleDropdown("topics")}>
          <p>Topics</p>
          <Icon name="chevronDown" />

          <GroupsCustomRefinement
            popupTitle="Topics"
            data={{
              content: [
                {
                  title: "Spiritual Growth",
                  attribute: "topics",
                },
                {
                  title: "Life & Support",
                  attribute: "topics",
                },
                {
                  title: "Community & Fun",
                  attribute: "topics",
                  showFooter: true,
                },
              ],
            }}
            onHide={closeAllDropdowns}
            showSection={activeDropdown === "topics"}
          />
        </div>

        {/* Preferences */}
        <div className="hidden xl:flex gap-4">
          <div
            className={cn(boxStyles)}
            onClick={() => toggleDropdown("preferences")}
          >
            <p>Preferences</p>
            <Icon name="chevronDown" />

            <GroupsCustomRefinement
              popupTitle="Preferences"
              data={{
                content: [
                  {
                    title: "Meeting Days",
                    attribute: "meetingDays",
                    isMeetingDays: true,
                  },
                  {
                    title: "Meeting Frequency",
                    attribute: "meetingFrequency",
                  },
                  {
                    title: "Child Care",
                    attribute: "adultOnly",
                    checkboxLayout: "horizontal",
                    checkbox: true,
                  },
                  {
                    title: "Language",
                    attribute: "language",
                    showFooter: true,
                  },
                ],
              }}
              onHide={closeAllDropdowns}
              showSection={activeDropdown === "preferences"}
            />
          </div>
        </div>
      </div>
      <div className="w-full items-center gap-4 h-full hidden md:flex xl:!hidden">
        <div className="w-px h-full bg-text-secondary hidden lg:block" />
        <Button
          intent="secondary"
          className="w-full max-w-[150px] ml-4 lg:ml-0"
          onClick={() => toggleDropdown("allFilters")}
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
              ? activeDropdown === "allFilters"
                ? "animate-slide-in z-1"
                : "animate-slide-out opacity-0 pointer-events-none z-[-1]"
              : activeDropdown === "allFilters"
              ? "z-1"
              : "opacity-0 pointer-events-none z-[-1]",
            "transition-all duration-300"
          )}
        >
          <AllFiltersPopup
            onHide={closeAllDropdowns}
            ageInput={ageInput}
            setAgeInput={setAgeInput}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        </div>
      </div>
    </div>
  );
}
