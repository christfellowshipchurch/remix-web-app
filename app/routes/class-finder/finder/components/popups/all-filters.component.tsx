import { useState } from "react";
import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { Stats, useInstantSearch } from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";
import { AllFiltersRefinementContent } from "~/routes/group-finder/components/popups/refinement-content.component";

export const AllClassFiltersPopup = ({ onHide }: { onHide: () => void }) => {
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
    <div className="bg-white flex flex-col pb-4 shadow-md w-full md:overflow-y-scroll md:max-h-[85vh]">
      {/* Title Section */}
      <div className="flex justify-between p-4 border-b border-neutral-lighter mb-4">
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

      {/* Filters Section */}
      <div className="flex flex-col gap-4 px-4">
        <FilterSection
          title="Topic"
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
      </div>

      {/* Bottom/Footer Section */}
      <div className="flex justify-between md:justify-end items-center gap-4 mx-4 p-2 py-4 border-t border-black">
        <div
          className="cursor-pointer text-text-secondary hover:text-ocean transition-colors duration-300"
          onClick={() => {
            clearAllRefinements();
            onHide();
          }}
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
    "font-semibold text-base group-hover:text-ocean transition-all duration-300";
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
            "transition-all duration-300 rotate-0 group-hover:text-ocean",
            showSection && "rotate-180"
          )}
        />
      </div>
      {/* Content */}
      <AllFiltersRefinementContent
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
