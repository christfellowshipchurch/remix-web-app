import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Stats, useRefinementList } from "react-instantsearch";
import { FinderLocationSearch } from "~/components/finders/location-search";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";

type FilterCoordinates = { lat: number | null; lng: number | null };

export interface FilterPopupSection {
  title?: string;
  attribute: string;
  input?: boolean;
  inputPlaceholder?: string;
  checkbox?: boolean;
  checkboxLayout?: "vertical" | "horizontal";
  isAgeRange?: boolean;
  isWeekdays?: boolean;
  isDropdown?: boolean;
  isLocation?: boolean;
  isMeetingType?: boolean;
  coordinates?: FilterCoordinates | null;
  setCoordinates?: (coordinates: FilterCoordinates | null) => void;
}

export interface FilterPopupData {
  content: FilterPopupSection[];
  showFooter?: boolean;
}

type SectionFooterRegistration = {
  hasSelection: boolean;
  reset: () => void;
};

interface FilterPopupProps {
  popupTitle: string;
  className?: string;
  data: FilterPopupData;
  showSection: boolean;
  onHide: () => void;
  ageInput?: string;
  setAgeInput?: (age: string) => void;
  style?: React.CSSProperties;
}

interface FilterPopupContentProps {
  sectionKey: string;
  showPopupFooter: boolean;
  registerSectionFooter: (
    key: string,
    entry: SectionFooterRegistration | null,
  ) => void;
  data: FilterPopupSection;
  ageInput?: string;
  setAgeInput?: (age: string) => void;
  popupTitle?: string;
}

export const FilterPopup = ({
  popupTitle,
  className,
  data,
  showSection,
  onHide,
  ageInput,
  setAgeInput,
  style,
}: FilterPopupProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [sectionFooterRegistry, setSectionFooterRegistry] = useState<
    Record<string, SectionFooterRegistration>
  >({});

  // Clear button in Footer only shows when there is a selection
  const registerSectionFooter = useCallback(
    (key: string, entry: SectionFooterRegistration | null) => {
      setSectionFooterRegistry((prev) => {
        const next = { ...prev };
        if (entry === null) {
          delete next[key];
        } else {
          next[key] = entry;
        }
        return next;
      });
    },
    [],
  );
  const hasAnyPopupSelection = Object.values(sectionFooterRegistry).some(
    (s) => s.hasSelection,
  );

  const clearAllPopupSections = () => {
    Object.values(sectionFooterRegistry).forEach((s) => s.reset());
  };

  return (
    <div
      ref={ref}
      className={cn(
        "cursor-default absolute top-[65px] right-1/2 translate-x-1/2 z-4",
        "w-[330px] xl:w-[380px] flex flex-col gap-4 bg-white",
        "rounded-2xl border border-neutral-lighter overflow-hidden",
        showSection
          ? "z-4 opacity-100"
          : "-left-[9999px] -z-1 opacity-0 pointer-events-none",
        className,
      )}
      style={
        showSection
          ? style
          : { ...style, left: "-9999px", pointerEvents: "none" }
      }
    >
      <div className="flex items-center justify-between p-4 pb-1">
        <h3 className="text-xl font-bold text-black">{popupTitle}</h3>
        <div className="cursor-pointer!" onClick={() => onHide()}>
          <Icon name="x" color="black" />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-4">
        {data.content.map((content, index) => (
          <div
            key={`${index}-${content.attribute}-${content.title ?? ""}`}
            className="flex flex-col gap-2"
          >
            {content.title && (
              <h3 className="font-semibold text-xs text-neutral-default tracking-[0.06em]">
                {content.title}
              </h3>
            )}
            <FilterPopupContent
              sectionKey={`${index}-${content.attribute}-${content.title ?? ""}`}
              showPopupFooter={Boolean(data.showFooter)}
              registerSectionFooter={registerSectionFooter}
              data={content}
              ageInput={ageInput}
              setAgeInput={setAgeInput}
              popupTitle={popupTitle}
            />
          </div>
        ))}
      </div>

      {data.showFooter && (
        <div
          className={cn(
            "flex items-center gap-4 px-4 pb-4 pt-2 border-t border-neutral-lighter",
            hasAnyPopupSelection ? "justify-between" : "justify-start",
          )}
        >
          <button
            type="button"
            disabled={!hasAnyPopupSelection}
            className={cn(
              "transition-all duration-300",
              hasAnyPopupSelection
                ? "cursor-pointer text-ocean opacity-100"
                : "cursor-not-allowed text-neutral-default opacity-50",
            )}
            onClick={() => clearAllPopupSections()}
          >
            Clear
          </button>

          {hasAnyPopupSelection ? (
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
          ) : null}
        </div>
      )}
    </div>
  );
};

const FilterPopupContent = ({
  sectionKey,
  showPopupFooter,
  registerSectionFooter,
  data,
  ageInput,
  setAgeInput,
  popupTitle,
}: FilterPopupContentProps) => {
  const { items, refine } = useRefinementList({ attribute: data.attribute });
  const [localAgeInput, setLocalAgeInput] = useState<string>(ageInput || "");

  // Topic categories for filtering
  const spiritualGrowthTopics = ["Bible Study", "Prayer", "Message Discussion"];
  const lifeSupportTopics = ["Marriage", "Parenting", "Finances"];
  const communityFunTopics = [
    "Friendship",
    "Sports",
    "Activty/Hobby",
    "Book Club",
    "Watch Party",
    "Podcast",
  ];

  const MEETING_DAYS_ORDER = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Filter items based on category and popup title
  const getFilteredItems = () => {
    if (popupTitle === "Topics" && data.attribute === "topics") {
      if (data.title === "Spiritual Growth") {
        return items.filter((item) =>
          spiritualGrowthTopics.includes(item.label),
        );
      } else if (data.title === "Life & Support") {
        return items.filter((item) => lifeSupportTopics.includes(item.label));
      } else if (data.title === "Community & Fun") {
        return items.filter((item) => communityFunTopics.includes(item.label));
      }
    }
    if (data.isWeekdays === true) {
      return [...items].sort(
        (a, b) =>
          MEETING_DAYS_ORDER.indexOf(a.label) -
          MEETING_DAYS_ORDER.indexOf(b.label),
      );
    }
    return items;
  };

  const filteredItems = getFilteredItems();

  const sortedForDropdown = data.isDropdown
    ? [...filteredItems].sort((a, b) => a.label.localeCompare(b.label))
    : filteredItems;

  const dropdownSelectValue =
    sortedForDropdown.find((item) => item.isRefined)?.value ?? "";

  const applyDropdownSelection = (value: string) => {
    sortedForDropdown.forEach((item) => {
      if (item.isRefined) refine(item.value);
    });
    if (value) refine(value);
  };

  // Sync local age input with parent
  useEffect(() => {
    if (ageInput !== undefined) {
      setLocalAgeInput(ageInput);
    }
  }, [ageInput]);

  const hasSectionSelection = useMemo(() => {
    if (data.isLocation) {
      const c = data.coordinates;
      return c != null && (c.lat != null || c.lng != null);
    }
    if (data.input) {
      return localAgeInput.trim() !== "";
    }
    if (data.isDropdown) {
      return dropdownSelectValue !== "";
    }
    return filteredItems.some((i) => i.isRefined);
  }, [
    data.isLocation,
    data.coordinates,
    data.input,
    data.isDropdown,
    localAgeInput,
    dropdownSelectValue,
    filteredItems,
  ]);

  const reset = useCallback(() => {
    items.forEach((item) => {
      if (item.isRefined) {
        refine(item.value);
      }
    });
    setLocalAgeInput("");
    setAgeInput?.("");
    if (data.isLocation) {
      data.setCoordinates?.(null);
    }
  }, [items, refine, setAgeInput, data.isLocation, data.setCoordinates]);

  useEffect(() => {
    if (!showPopupFooter) return;
    registerSectionFooter(sectionKey, {
      hasSelection: hasSectionSelection,
      reset,
    });
    return () => registerSectionFooter(sectionKey, null);
  }, [
    showPopupFooter,
    sectionKey,
    hasSectionSelection,
    reset,
    registerSectionFooter,
  ]);

  const styles = {
    checkbox: "text-text-primary font-regular text-base",
    button:
      "min-w-0 min-h-0 px-4 py-2 bg-gray text-sm border-none font-semibold text-neutral-darker hover:bg-ocean transition-all duration-300 rounded-[16777200px]",
    meetingTypeButton:
      "flex gap-1 text-text-primary font-normal text-base !pr-3",
    buttonRefined: "bg-ocean text-white hover:bg-navy",
    input:
      "w-full max-w-[120px] text-base px-2 focus:outline-none rounded-lg border border-[#AAAAAA] py-2 flex h-full",
  };

  return (
    <>
      {!data.isDropdown && (
        <div
          className={cn(
            "flex bg-white",
            data.checkbox && data.checkboxLayout === "vertical"
              ? "gap-4 flex-col"
              : "flex-wrap gap-2",
          )}
        >
          {data.isLocation ? (
            <FinderLocationSearch
              coordinates={data.coordinates || null}
              setCoordinates={data.setCoordinates || (() => {})}
            />
          ) : (
            <>
              {data.input ? (
                <input
                  type="number"
                  placeholder={data.inputPlaceholder || "Enter your age"}
                  className={styles.input}
                  value={localAgeInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalAgeInput(value);
                    if (setAgeInput) {
                      setAgeInput(value);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  min="13"
                  max="120"
                />
              ) : (
                <>
                  {filteredItems.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={cn(
                          data.checkboxLayout === "horizontal" &&
                            "flex w-fit gap-x-2 pr-2",
                        )}
                      >
                        {data.checkbox ? (
                          <div
                            className="flex items-center gap-2 w-fit cursor-pointer!"
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                              e.stopPropagation();
                              refine(item.value);
                            }}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 border border-ocean rounded-sm bg-ocean-subdued hover:bg-ocean transition-all duration-300",
                                item.isRefined && "bg-ocean",
                              )}
                            />
                            <div className={styles.checkbox}>
                              {data.attribute === "adultOnly"
                                ? item.value === "false"
                                  ? "Children Welcome"
                                  : "Adult Only"
                                : item.label}
                            </div>
                          </div>
                        ) : (
                          <Button
                            key={index}
                            intent="secondary"
                            className={cn(
                              styles.button,
                              data.isMeetingType && styles.meetingTypeButton,
                              item.isRefined && styles.buttonRefined,
                            )}
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                              e.stopPropagation();
                              refine(item.value);
                            }}
                          >
                            {data.isMeetingType && (
                              <Icon
                                name={
                                  item.label === "Virtual" ? "globe" : "map"
                                }
                                size={18}
                              />
                            )}
                            {data.isWeekdays
                              ? item.label === "Thursday"
                                ? "Thur"
                                : item.label.substring(0, 3)
                              : item.label}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      )}

      {data.isDropdown && (
        <div className="flex flex-col gap-2 w-full">
          <div className="relative w-full">
            <select
              value={dropdownSelectValue}
              onChange={(e) => applyDropdownSelection(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className={cn(
                "flex items-center justify-between w-full rounded-lg p-3",
                "border border-black text-neutral-default bg-white",
                "focus:outline-none focus:ring-2 focus:ring-transparent",
                "appearance-none cursor-pointer",
              )}
              aria-label={
                popupTitle
                  ? `Select ${popupTitle.toLowerCase()}`
                  : "Select filter"
              }
            >
              <option value="">Select</option>
              {sortedForDropdown.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
              )}
            >
              <Icon name="chevronDown" size={18} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
