import type { RefObject } from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useInstantSearch, useRefinementList } from "react-instantsearch";
import startCase from "lodash/startCase";

import {
  useStickyTopBelowNavbarClass,
  useStickyTopBelowNavbarOffsetPx,
} from "~/hooks/use-sticky-top-below-navbar";
import { MobileFilterBottomSheet } from "~/components/finders/search-filters/filter-popup.component";
import { finderFilterSectionSubtitleClass } from "~/components/finders/search-filters/filter-section-subtitle";
import { finderLocationInputBaseClass } from "~/components/finders/location-search";
import { ActiveFilters } from "~/components/finders/search-filters/active-filter.component";
import { FiltersFooter } from "~/routes/group-finder/components/filters/filters-footer.component";
import { Icon } from "~/primitives/icon/icon";
import { cn } from "~/lib/utils";

const PILL_BASE =
  "flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-300";

const pillIdle =
  "border-[#DEE0E3] text-neutral-default hover:border-neutral-default";
const pillActive = "border-ocean bg-ocean/10 text-ocean hover:border-ocean";

const finderPopupPillBase =
  "h-auto min-h-0 border-0 bg-gray px-3 py-1.5 text-sm font-semibold leading-tight text-text-primary transition-colors duration-300 hover:bg-neutral-200 rounded-[16777200px]";
const finderPopupPillSelected =
  "bg-ocean !text-white hover:bg-navy hover:!text-white";

const PINNED_SLOT_MIN_H = "min-h-[5.5rem]";

export function EventsMobileFinderFilters({
  onClearAllToUrl,
  pinEndRef,
}: {
  onClearAllToUrl: () => void;
  /** Bottom of the events hits + pagination block; pins only while this is below the nav line. */
  pinEndRef?: RefObject<HTMLDivElement | null>;
}) {
  const { setIndexUiState, indexUiState } = useInstantSearch();
  const [openSheet, setOpenSheet] = useState<"location" | "type" | null>(null);
  const pinSlotRef = useRef<HTMLDivElement>(null);
  const [filtersPinned, setFiltersPinned] = useState(false);
  const stickyTopClass = useStickyTopBelowNavbarClass();
  const stickyTopPx = useStickyTopBelowNavbarOffsetPx();

  const { items: locationItems } = useRefinementList({
    attribute: "eventLocations",
  });
  const { items: categoryItems } = useRefinementList({
    attribute: "eventCategories",
  });

  const rl = indexUiState?.refinementList ?? {};
  const selectedLocation = rl.eventLocations?.[0] ?? "";
  const selectedCategories = rl.eventCategories ?? [];
  const selectedCategory =
    selectedCategories.length === 1 ? selectedCategories[0] : null;

  const hasLocation = Boolean(selectedLocation);
  const hasType = Boolean(selectedCategory);

  const sortedLocations = useMemo(
    () => [...locationItems].sort((a, b) => a.label.localeCompare(b.label)),
    [locationItems],
  );
  const sortedCategories = useMemo(
    () => [...categoryItems].sort((a, b) => a.label.localeCompare(b.label)),
    [categoryItems],
  );

  const applyLocation = (value: string, closeSheet: boolean) => {
    setIndexUiState((prev) => ({
      ...prev,
      refinementList: {
        ...prev.refinementList,
        eventLocations: value ? [value] : [],
      },
      page: 0,
    }));
    if (closeSheet) setOpenSheet(null);
  };

  const applyCategory = (value: string | null, closeSheet: boolean) => {
    setIndexUiState((prev) => ({
      ...prev,
      refinementList: {
        ...prev.refinementList,
        eventCategories: value ? [value] : [],
      },
      page: 0,
    }));
    if (closeSheet) setOpenSheet(null);
  };

  const locationPillHighlighted = openSheet === "location" || hasLocation;
  const typePillHighlighted = openSheet === "type" || hasType;

  useLayoutEffect(() => {
    const updatePinned = () => {
      const startEl = pinSlotRef.current;
      if (!startEl) return;
      const line = stickyTopPx + 0.5;
      const startTop = startEl.getBoundingClientRect().top;
      const endBottom = pinEndRef?.current
        ? pinEndRef.current.getBoundingClientRect().bottom
        : Number.POSITIVE_INFINITY;
      // Pin after the filter row reaches the nav offset, until the results block has scrolled past.
      setFiltersPinned(startTop <= line && endBottom > line);
    };

    updatePinned();
    window.addEventListener("scroll", updatePinned, { passive: true });
    window.addEventListener("resize", updatePinned, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePinned);
      window.removeEventListener("resize", updatePinned);
    };
  }, [pinEndRef, stickyTopPx]);

  const sheetFooter = (onClear: () => void, clearDisabled: boolean) => (
    <div className="min-w-0 shrink-0 bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_36px_-12px_rgba(15,23,42,0.14)]">
      <FiltersFooter
        onHide={() => setOpenSheet(null)}
        onClearAll={onClear}
        clearAllDisabled={clearDisabled}
      />
    </div>
  );

  const pillRow = (
    <div className="mx-auto flex w-full max-w-screen-content min-w-0 flex-col gap-3 py-4">
      <div className="flex min-w-0 items-stretch gap-2">
        <button
          type="button"
          onClick={() => setOpenSheet("location")}
          className={cn(
            PILL_BASE,
            locationPillHighlighted ? pillActive : pillIdle,
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Icon
              name="map"
              size={16}
              className={cn(
                "shrink-0 transition-colors duration-300",
                locationPillHighlighted
                  ? "text-ocean"
                  : "text-neutral-default",
              )}
              aria-hidden
            />
            <span className="min-w-0 truncate text-left">Location</span>
          </div>
          <Icon
            name="chevronDown"
            size={16}
            className={cn(
              "shrink-0 transition-transform duration-300",
              openSheet === "location" && "rotate-180",
              locationPillHighlighted ? "text-ocean" : "text-neutral-default",
            )}
            aria-hidden
          />
        </button>

        <button
          type="button"
          onClick={() => setOpenSheet("type")}
          className={cn(PILL_BASE, typePillHighlighted ? pillActive : pillIdle)}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Icon
              name="bookOpen"
              size={16}
              className={cn(
                "shrink-0 transition-colors duration-300",
                typePillHighlighted ? "text-ocean" : "text-neutral-default",
              )}
              aria-hidden
            />
            <span className="min-w-0 truncate text-left">Type</span>
          </div>
          <Icon
            name="chevronDown"
            size={16}
            className={cn(
              "shrink-0 transition-transform duration-300",
              openSheet === "type" && "rotate-180",
              typePillHighlighted ? "text-ocean" : "text-neutral-default",
            )}
            aria-hidden
          />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={pinSlotRef}
        className={cn("w-full min-w-0", filtersPinned && PINNED_SLOT_MIN_H)}
      >
        <div
          className={cn(
            "z-20 w-full min-w-0 border-b border-black/5 bg-white shadow-sm content-padding select-none transition-all duration-300",
            filtersPinned
              ? cn("fixed left-0 right-0", stickyTopClass)
              : "relative",
          )}
        >
          {pillRow}
        </div>
      </div>

      <div className="bg-white content-padding">
        <ActiveFilters onClearAllToUrl={onClearAllToUrl} />
      </div>

      {openSheet === "location" ? (
        <MobileFilterBottomSheet
          title="Location"
          onClose={() => setOpenSheet(null)}
          scrollable={
            <div className="flex min-h-0 flex-col gap-3 px-4 pb-4 pt-1">
              <h3 className={finderFilterSectionSubtitleClass}>
                Christ Fellowship campus
              </h3>
              <div className="relative w-full">
                <select
                  value={selectedLocation}
                  onChange={(e) => applyLocation(e.target.value, false)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={cn(
                    finderLocationInputBaseClass,
                    "flex w-full cursor-pointer appearance-none items-center bg-white pr-9",
                  )}
                  aria-label="Select Christ Fellowship campus"
                >
                  <option value="">All locations</option>
                  {sortedLocations.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon
                    name="chevronDown"
                    size={16}
                    className="text-[#909090]"
                  />
                </div>
              </div>
            </div>
          }
          footer={sheetFooter(() => applyLocation("", false), !hasLocation)}
        />
      ) : null}

      {openSheet === "type" ? (
        <MobileFilterBottomSheet
          title="Type"
          onClose={() => setOpenSheet(null)}
          scrollable={
            <div className="flex min-h-0 flex-col gap-3 px-4 pb-4 pt-1">
              <h3 className={finderFilterSectionSubtitleClass}>Event type</h3>
              <div className="flex min-w-0 max-w-full flex-wrap gap-1.5 bg-white">
                <button
                  type="button"
                  className={cn(
                    finderPopupPillBase,
                    !hasType && finderPopupPillSelected,
                  )}
                  onClick={() => applyCategory(null, true)}
                >
                  Upcoming
                </button>
                {sortedCategories.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={cn(
                      finderPopupPillBase,
                      selectedCategory === item.value &&
                        finderPopupPillSelected,
                    )}
                    onClick={() => applyCategory(item.value, true)}
                  >
                    {startCase(item.label)}
                  </button>
                ))}
              </div>
            </div>
          }
          footer={sheetFooter(() => applyCategory(null, false), !hasType)}
        />
      ) : null}
    </>
  );
}
