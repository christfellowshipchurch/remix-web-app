import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { AllFiltersRefinementContent } from "./refinement-content.component";

interface AllFiltersFilterSectionProps {
  title: string;
  attribute: string;
  hideBorder?: boolean;
  isCheckbox?: boolean;
  isDropdown?: boolean;
  isMeetingType?: boolean;
  isLocation?: boolean;
  isTopics?: boolean;
  isPeopleGroup?: boolean;
  checkboxLayout?: "vertical" | "horizontal";
  showSection: boolean;
  selectedValue?: string;
  setShowSection: (show: boolean) => void;
  setSelectedValue?: (value: string) => void;
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

export const AllFiltersFilterSection = ({
  title,
  attribute,
  hideBorder = false,
  isCheckbox = false,
  isDropdown = false,
  isMeetingType = false,
  isLocation = false, // Location Search Box
  isTopics = false,
  isPeopleGroup = false,
  checkboxLayout = "vertical",
  showSection,
  selectedValue,
  setSelectedValue,
  setShowSection,
  ageInput,
  setAgeInput,
  coordinates,
  setCoordinates,
}: AllFiltersFilterSectionProps) => {
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
            isLocation: isLocation,
            isTopics: isTopics,
            isPeopleGroup: isPeopleGroup,
            checkboxLayout: checkboxLayout,
          },
        }}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        showSection={showSection}
        ageInput={ageInput}
        setAgeInput={setAgeInput}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
    </div>
  );
};
