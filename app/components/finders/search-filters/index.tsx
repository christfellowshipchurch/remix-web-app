import { useState, useRef, useEffect } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { FilterPopup } from "~/components/finders/search-filters/filter-popup.component";
import { AllClassFiltersPopup } from "~/routes/class-finder/finder/components/popups/all-filters.component";
import { cn } from "~/lib/utils";
import { AlgoliaFinderClearAllButton } from "~/routes/group-finder/components/clear-all-button.component";

export function SearchFilters({
  onClearAllToUrl,
}: {
  onClearAllToUrl: () => void;
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
    "relative flex items-center justify-between w-full max-w-[140px] xl:max-w-[148px] rounded-lg p-3 border border-[#DEE0E3] transition-all duration-300 hover:border-neutral-default md:w-[900px] text-neutral-default font-semibold cursor-pointer";

  return (
    <div className="hidden md:flex items-center gap-4">
      <div
        ref={containerRef}
        className="flex gap-4 w-full bg-white col-span-1 h-full min-w-[300px] items-center"
      >
        <div className="hidden lg:flex gap-2 w-full">
          {/* Topic */}
          <div
            className={cn(dropdownButtonStyles)}
            onClick={() => toggleDropdown("topic")}
          >
            <Icon name="bookOpen" className="text-neutral-default" />
            <p>Topic</p>
            <Icon
              name="chevronDown"
              className={cn(
                "transition-transform duration-300",
                activeDropdown === "topic" && "rotate-180",
              )}
            />

            <FilterPopup
              popupTitle="Topic"
              data={{
                showFooter: true,
                content: [
                  {
                    title: "LEARN ABOUT",
                    attribute: "topic",
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
            <Icon
              name="chevronDown"
              className={cn(
                "transition-transform duration-300",
                activeDropdown === "language" && "rotate-180",
              )}
            />

            <FilterPopup
              popupTitle="Language"
              data={{
                showFooter: true,
                content: [
                  {
                    attribute: "language",
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
            <Icon
              name="chevronDown"
              className={cn(
                "transition-transform duration-300",
                activeDropdown === "format" && "rotate-180",
              )}
            />

            <FilterPopup
              popupTitle="Format"
              data={{
                showFooter: true,
                content: [
                  {
                    attribute: "format",
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
              "w-full max-w-[484px] h-auto max-h-[85vh] md:max-h-none flex flex-col",
              "hidden md:flex",
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
              onClearAllToUrl={onClearAllToUrl}
            />
          </div>
        </div>
      </div>

      <AlgoliaFinderClearAllButton
        className="hidden md:block"
        onClearAllToUrl={onClearAllToUrl}
      />
    </div>
  );
}
