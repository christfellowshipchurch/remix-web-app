import { useState, useRef, useEffect } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { GroupsFinderDropdwnPopup } from "~/routes/group-finder/components/filters/groups-finder-dropdown-popup.component";
import { AllClassFiltersPopup } from "~/routes/class-finder/finder/components/popups/all-filters.component";
import { cn } from "~/lib/utils";

export function DesktopClassFilters({
  coordinates,
  setCoordinates,
}: {
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
  setCoordinates: (
    coordinates: {
      lat: number | null;
      lng: number | null;
    } | null,
  ) => void;
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

  const dropdownButtonStyles =
    "relative flex items-center justify-between w-full max-w-[140px] xl:max-w-[148px] rounded-lg p-3 border border-neutral-default md:w-[900px] text-text-secondary font-semibold cursor-pointer";

  return (
    <div
      ref={containerRef}
      className="flex gap-4 w-full bg-white col-span-1 h-full min-w-[300px] items-center"
    >
      <div className="hidden lg:flex gap-4 w-full">
        {/* Location Select Box */}
        <div
          className={cn(dropdownButtonStyles)}
          onClick={() => toggleDropdown("location")}
        >
          <p>Location</p>
          <Icon name="chevronDown" />

          <GroupsFinderDropdwnPopup
            popupTitle="Location"
            data={{
              content: [
                {
                  attribute: "campus",
                  isLocation: true,
                  coordinates: coordinates,
                  setCoordinates: setCoordinates,
                  showFooter: true,
                },
              ],
            }}
            onHide={closeAllDropdowns}
            showSection={activeDropdown === "location"}
          />
        </div>

        {/* Topic */}
        <div
          className={cn(dropdownButtonStyles)}
          onClick={() => toggleDropdown("topic")}
        >
          <p>Topic</p>
          <Icon name="chevronDown" />

          <GroupsFinderDropdwnPopup
            popupTitle="Topic"
            data={{
              content: [
                {
                  attribute: "topic",
                  showFooter: true,
                },
              ],
            }}
            onHide={closeAllDropdowns}
            showSection={activeDropdown === "topic"}
          />
        </div>

        {/* Language */}

        <div
          className={cn(dropdownButtonStyles)}
          onClick={() => toggleDropdown("language")}
        >
          <p>Language</p>
          <Icon name="chevronDown" />

          <GroupsFinderDropdwnPopup
            popupTitle="Language"
            data={{
              content: [
                {
                  attribute: "language",
                  showFooter: true,
                },
              ],
            }}
            onHide={closeAllDropdowns}
            showSection={activeDropdown === "language"}
          />
        </div>

        {/* Format */}

        <div
          className={cn(dropdownButtonStyles)}
          onClick={() => toggleDropdown("format")}
        >
          <p>Format</p>
          <Icon name="chevronDown" />

          <GroupsFinderDropdwnPopup
            popupTitle="Format"
            data={{
              content: [
                {
                  attribute: "format",
                  showFooter: true,
                },
              ],
            }}
            onHide={closeAllDropdowns}
            showSection={activeDropdown === "format"}
          />
        </div>
      </div>

      <div className="w-full items-center gap-4 h-full hidden md:flex lg:hidden">
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
            "transition-all duration-300",
          )}
        >
          <AllClassFiltersPopup
            onHide={closeAllDropdowns}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        </div>
      </div>
    </div>
  );
}
