import React from "react";
import { useRefinementList } from "react-instantsearch";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { PeopleSubsection } from "./people-subsection.component";
import { FinderLocationSearch } from "~/components/finders-location-search/location-search.component";

interface AllFiltersRefinementContentProps {
  data: {
    content: {
      attribute: string;
      isCheckbox?: boolean;
      isDropdown?: boolean;
      isMeetingType?: boolean;
      isLocation?: boolean;
      isTopics?: boolean;
      isPeopleGroup?: boolean;
      checkboxLayout?: "vertical" | "horizontal";
      showFooter?: boolean;
    };
  };
  selectedValue?: string;
  setSelectedValue?: (value: string) => void;
  showSection: boolean;
  ageInput?: string;
  setAgeInput?: (age: string) => void;
  coordinates?: {
    lat: number | null;
    lng: number | null;
  } | null;
  setCoordinates?: (
    coordinates: {
      lat: number | null;
      lng: number | null;
    } | null
  ) => void;
}

export const AllFiltersRefinementContent = ({
  data,
  selectedValue,
  setSelectedValue,
  showSection,
  ageInput,
  setAgeInput,
  coordinates,
  setCoordinates,
}: AllFiltersRefinementContentProps) => {
  const { items, refine } = useRefinementList({
    attribute: data.content.attribute,
  });
  const content = data.content;

  // Track which subsections have items
  const [hasPeopleWhoAreItems, setHasPeopleWhoAreItems] = React.useState(false);

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

  // Check if topic categories have items
  const hasSpiritualGrowthItems =
    content.isTopics &&
    content.attribute === "topics" &&
    items.some((item) => spiritualGrowthTopics.includes(item.label));
  const hasLifeSupportItems =
    content.isTopics &&
    content.attribute === "topics" &&
    items.some((item) => lifeSupportTopics.includes(item.label));
  const hasCommunityFunItems =
    content.isTopics &&
    content.attribute === "topics" &&
    items.some((item) => communityFunTopics.includes(item.label));
  const styles = {
    checkbox: "text-text-primary font-regular text-base",
    button:
      "min-w-0 min-h-0 px-2 py-[6px] text-sm font-semibold text-black border border-neutral-light hover:border-ocean transition-all duration-300 rounded-[5px]",
    meetingTypeButton:
      "flex gap-1 text-text-primary font-normal text-base !pr-3",
    buttonRefined:
      "bg-ocean text-white border-ocean hover:!bg-navy hover:!border-navy",
  };

  const MEETING_DAYS_ORDER = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const sortedItems =
    content.attribute === "meetingDays"
      ? [...items].sort(
          (a, b) =>
            MEETING_DAYS_ORDER.indexOf(a.label) -
            MEETING_DAYS_ORDER.indexOf(b.label)
        )
      : items;

  const renderButton = (
    item: { label: string; value: string; isRefined: boolean; count: number },
    index: number
  ) => (
    <Button
      key={index}
      intent="secondary"
      className={cn(
        styles.button,
        content.isMeetingType && styles.meetingTypeButton,
        item.isRefined && styles.buttonRefined
      )}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        refine(item.value);
      }}
    >
      {content.isMeetingType && (
        <Icon name={item.label === "Virtual" ? "globe" : "map"} size={18} />
      )}
      {content.attribute === "meetingDays"
        ? item.label === "Thursday"
          ? "Thur"
          : item.label.substring(0, 3)
        : item.label}
    </Button>
  );

  const renderCheckbox = (
    item: { label: string; value: string; isRefined: boolean; count: number },
    index: number
  ) => (
    <div
      key={index}
      className="flex items-center gap-2 w-fit !cursor-pointer"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        refine(item.value);
      }}
    >
      <div
        className={cn(
          "w-4 h-4 border border-ocean rounded-sm bg-[#E7F9FE] hover:bg-ocean transition-all duration-300",
          item.isRefined && "bg-ocean"
        )}
      />
      <div className={styles.checkbox}>
        {content.attribute === "adultOnly"
          ? item.value === "false"
            ? "Children Welcome"
            : "Adult Only"
          : item.label}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "cursor-default",
        "flex flex-col gap-4 overflow-hidden",
        showSection ? "h-auto" : "h-0"
      )}
    >
      <div className="flex flex-col gap-5">
        {/* Location Search */}
        {content.isLocation && coordinates !== undefined && setCoordinates ? (
          <div className="flex flex-col gap-2">
            {/* Meeting Type */}
            <h3 className="text-base text-black">Meeting Type</h3>
            <div
              className={cn(
                "flex bg-white pr-4",
                content.isCheckbox && content.checkboxLayout === "vertical"
                  ? "gap-4 flex-col"
                  : "flex-wrap gap-y-2 gap-x-2"
              )}
            >
              {sortedItems.map((item, index) => renderButton(item, index))}
            </div>

            {/* Location Search */}
            <h3 className="text-base text-black mt-4">Location Radius</h3>
            <FinderLocationSearch
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
          </div>
        ) : content.isPeopleGroup ? (
          <div className="flex flex-col gap-6">
            {/* People (groupFor) - no header since main button already says "People" */}
            <div className="flex flex-col gap-2">
              <PeopleSubsection attribute="groupFor" />
            </div>

            {/* Seasons of Life (peopleWhoAre) */}
            <div className="flex flex-col gap-2">
              {hasPeopleWhoAreItems && (
                <h3 className="text-base text-black">Seasons of Life</h3>
              )}
              <PeopleSubsection
                attribute="peopleWhoAre"
                onItemsChange={setHasPeopleWhoAreItems}
              />
            </div>

            {/* Your Age */}
            <div className="flex flex-col gap-2">
              <h3 className="text-base text-black">Enter Your Age</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="13"
                  max="120"
                  placeholder="Your age"
                  value={ageInput}
                  onChange={(e) => setAgeInput?.(e.target.value)}
                  className="w-full max-w-[120px] text-base px-2 focus:outline-none rounded-lg border border-[#AAAAAA] py-2 flex h-full"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        ) : content.attribute === "ageRange" ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-base text-black">Enter Your Age</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="13"
                max="120"
                placeholder="Your age"
                value={ageInput}
                onChange={(e) => setAgeInput?.(e.target.value)}
                className="w-full max-w-[120px] text-base px-2 focus:outline-none rounded-lg border border-[#AAAAAA] py-2 flex h-full"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm text-gray-600">years old</span>
            </div>
          </div>
        ) : content.isTopics && content.attribute === "topics" ? (
          <div className="flex flex-col gap-6">
            {/* Spiritual Growth */}
            {hasSpiritualGrowthItems && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base text-black">Spiritual Growth</h3>
                <div className="flex flex-wrap gap-y-2 gap-x-2">
                  {items
                    .filter((item) =>
                      spiritualGrowthTopics.includes(item.label)
                    )
                    .map((item, index) => (
                      <div key={index}>{renderButton(item, index)}</div>
                    ))}
                </div>
              </div>
            )}

            {/* Life & Support */}
            {hasLifeSupportItems && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base text-black">Life & Support</h3>
                <div className="flex flex-wrap gap-y-2 gap-x-2">
                  {items
                    .filter((item) => lifeSupportTopics.includes(item.label))
                    .map((item, index) => (
                      <div key={index}>{renderButton(item, index)}</div>
                    ))}
                </div>
              </div>
            )}

            {/* Community & Fun */}
            {hasCommunityFunItems && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base text-black">Community & Fun</h3>
                <div className="flex flex-wrap gap-y-2 gap-x-2">
                  {items
                    .filter((item) => communityFunTopics.includes(item.label))
                    .map((item, index) => (
                      <div key={index}>{renderButton(item, index)}</div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Regular Checkbox & Buttons Option */
          !content.isDropdown && (
            <div
              className={cn(
                "flex bg-white pr-4",
                content.isCheckbox && content.checkboxLayout === "vertical"
                  ? "gap-4 flex-col"
                  : "flex-wrap gap-y-2 gap-x-2"
              )}
            >
              {sortedItems.map((item, index) => (
                <div key={index}>
                  {content.isCheckbox
                    ? renderCheckbox(item, index)
                    : renderButton(item, index)}
                </div>
              ))}
            </div>
          )
        )}

        {/* Dropdown Option */}
        {content.isDropdown && setSelectedValue && (
          <div className="flex flex-col gap-2">
            <div className={cn("relative")}>
              <select
                value={selectedValue}
                onChange={(e) => {
                  if (e.target.value === "") {
                    // Clear all refinements for this attribute
                    items.forEach((item) => {
                      if (item.isRefined) {
                        refine(item.value);
                      }
                    });
                    setSelectedValue("");
                  } else {
                    refine(e.target.value);
                    setSelectedValue(e.target.value);
                  }
                }}
                className={cn(
                  "flex items-center justify-between w-full rounded-lg p-3",
                  "border border-black text-neutral-default",
                  "focus:outline-none focus:ring-2 focus:ring-transparent",
                  "appearance-none"
                )}
                aria-label="Select meeting time"
              >
                <option value="">Select</option>
                {sortedItems.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                )}
              >
                <Icon name="chevronDown" size={18} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
