import React, { useState } from "react";
import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import {
  Stats,
  useRefinementList,
  useInstantSearch,
} from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";
import { icons } from "~/lib/icons";

export const AllFilters = ({ onHide }: { onHide: () => void }) => {
  const [showMeetingType, setShowMeetingType] = useState(true);
  const [showGroupType, setShowGroupType] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const [showMeetingTimes, setShowMeetingTimes] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");

  const { setIndexUiState } = useInstantSearch();

  const clearAllRefinements = () => {
    setSelectedValue("");
    setIndexUiState((state) => ({
      ...state,
      refinementList: {},
    }));
  };

  return (
    <div className="absolute -top-[63px] left-0 bg-white flex flex-col gap-4 pb-4 shadow-md w-full">
      {/* Title Section */}
      <div className="flex justify-between p-4 border-b border-neutral-lighter">
        <p className="font-bold text-xl">Filters</p>
        <div className="flex gap-2 w-fit cursor-pointer" onClick={onHide}>
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
          <Icon name="x" />
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4">
        <FilterSection
          title="Meeting Type"
          attribute="meetingType"
          showSection={showMeetingType}
          setShowSection={setShowMeetingType}
          isMeetingType={true}
        />
        <FilterSection
          title="People"
          attribute="preferences"
          showSection={showPeople}
          setShowSection={setShowPeople}
        />
        <FilterSection
          title="Group Type"
          attribute="subPreferences"
          isCheckbox={true}
          showSection={showGroupType}
          setShowSection={setShowGroupType}
        />
        <FilterSection
          title="Meeting Times"
          attribute="meetingDay"
          showSection={showMeetingTimes}
          setShowSection={setShowMeetingTimes}
          hideBorder={true}
          isDropdown={true}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />

        <div className="flex justify-between md:justify-end items-center gap-4 p-2 py-4 border-t border-black">
          <div
            className="cursor-pointer text-text-secondary hover:text-ocean transition-colors duration-300"
            onClick={clearAllRefinements}
          >
            <span className="hidden md:block font-semibold text-base text-black">
              Cancel
            </span>
            <span className="md:hidden">Clear All</span>
          </div>
          <div className="hidden md:block">
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
          </div>
          <div className="md:hidden">
            <Button
              intent="primary"
              className="w-fit font-normal text-base"
              onClick={onHide}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({
  title,
  attribute,
  hideBorder = false,
  isCheckbox = false,
  isDropdown = false,
  isMeetingType = false,
  showSection,
  selectedValue,
  setSelectedValue,
  setShowSection,
}: {
  title: string;
  attribute: string;
  hideBorder?: boolean;
  isCheckbox?: boolean;
  isDropdown?: boolean;
  isMeetingType?: boolean;
  showSection: boolean;
  selectedValue?: string;
  setShowSection: (show: boolean) => void;
  setSelectedValue?: (value: string) => void;
}) => {
  const titleStyles =
    "font-semibold text-base group-hover:text-neutral-500 transition-all duration-300";
  return (
    <div
      className={cn(
        "border-b border-black w-full flex flex-col gap-4",
        showSection && "pb-5",
        hideBorder && "border-b-0"
      )}
    >
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setShowSection(!showSection)}
      >
        <p className={titleStyles}>{title}</p>
        <Icon
          name="chevronDown"
          className={cn(
            "transition-all duration-300 rotate-0 group-hover:text-neutral-500",
            showSection && "rotate-180"
          )}
        />
      </div>
      {/* Content */}
      <RefinementContent
        data={{
          content: {
            attribute: attribute,
            isCheckbox: isCheckbox,
            isDropdown: isDropdown,
            isMeetingType: isMeetingType,
          },
        }}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        showSection={showSection}
      />
    </div>
  );
};

export const RefinementContent = ({
  data,
  selectedValue,
  setSelectedValue,
  showSection,
}: {
  data: {
    content: {
      attribute: string;
      icon?: keyof typeof icons;
      isCheckbox?: boolean;
      isDropdown?: boolean;
      isMeetingType?: boolean;
      showFooter?: boolean;
    };
  };
  selectedValue?: string;
  setSelectedValue?: (value: string) => void;
  showSection: boolean;
}) => {
  const { items, refine } = useRefinementList({
    attribute: data.content.attribute,
  });
  const content = data.content;
  const checkboxStyle = "text-text-primary font-regular text-base";
  const buttonStyles =
    "min-w-0 min-h-0 px-2 py-[6px] text-sm font-semibold text-black border border-neutral-light hover:border-ocean transition-all duration-300 rounded-[5px]";
  const meetingTypeButtonStyle =
    "flex gap-1 text-text-primary font-normal text-base ";
  const buttonRefinedStyle =
    "bg-ocean text-white border-ocean hover:!bg-navy hover:!border-navy";

  return (
    <div
      className={cn(
        "cursor-default",
        "flex flex-col gap-4 overflow-hidden",
        showSection ? "h-auto" : "h-0"
      )}
    >
      <div className="flex flex-col gap-5">
        {/* Checkbox & Buttons Option */}
        {!content.isDropdown && (
          <div
            className={cn(
              "flex bg-white pr-4",
              content.isCheckbox
                ? "gap-4 flex-col"
                : "flex-wrap gap-y-2 gap-x-2"
            )}
          >
            {items.map((item, index) => {
              return (
                <div key={index}>
                  {/* Checkbox Option */}
                  {content.isCheckbox ? (
                    <div
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
                      <div className={checkboxStyle}>{item.label}</div>
                    </div>
                  ) : (
                    // Buttons Option
                    <Button
                      key={index}
                      intent="secondary"
                      className={cn(
                        buttonStyles,
                        content.isMeetingType && meetingTypeButtonStyle,
                        item.isRefined && buttonRefinedStyle
                      )}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        refine(item.value);
                      }}
                    >
                      {content.isMeetingType && (
                        <Icon
                          name={item.label === "Virtual" ? "globe" : "map"}
                          size={18}
                        />
                      )}
                      {item.label}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Dropdown Option */}
        {content.isDropdown && setSelectedValue && (
          <div className="flex flex-col gap-2">
            <div className={cn("relative")}>
              <select
                value={selectedValue}
                onChange={(e) => {
                  refine(e.target.value);
                  setSelectedValue(e.target.value);
                }}
                className={cn(
                  "flex items-center justify-between w-full rounded-[8px] p-3",
                  "border border-black text-[#666666]",
                  "focus:outline-none focus:ring-2 focus:ring-transparent",
                  "appearance-none"
                )}
                aria-label="Select meeting time"
              >
                <option value="" disabled>
                  Select a meeting time
                </option>
                {items.map((item) => (
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
