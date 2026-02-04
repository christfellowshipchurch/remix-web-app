import { useState } from "react";
import { useInstantSearch } from "react-instantsearch";
import { AllFiltersFilterSection } from "./filter-section.component";
import { FiltersHeader } from "./filters-header.component";
import { FiltersFooter } from "./filters-footer.component";

export const AllGroupFiltersPopup = ({
  onHide,
  ageInput,
  setAgeInput,
  coordinates,
  setCoordinates,
  onClearAllToUrl,
}: {
  onHide: () => void;
  ageInput: string;
  setAgeInput: (age: string) => void;
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
  onClearAllToUrl?: () => void;
}) => {
  const [showCampus, setShowCampus] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showMeetingDays, setShowMeetingDays] = useState(false);
  const [showMeetingFrequency, setShowMeetingFrequency] = useState(false);
  const [showChildCare, setShowChildCare] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const { setIndexUiState } = useInstantSearch();

  const clearAllRefinements = () => {
    setIndexUiState((state) => ({
      ...state,
      query: "",
      refinementList: {},
      page: 0,
    }));
    onClearAllToUrl?.();
    setSelectedValue("");
    setCoordinates?.({ lat: null, lng: null });
    setAgeInput?.("");
    setShowLocation(false);
    setShowTopics(false);
    setShowPeople(false);
    setShowMeetingDays(false);
    setShowMeetingFrequency(false);
    setShowChildCare(false);
    setShowLanguage(false);
  };

  return (
    <div className="bg-white flex flex-col shadow-md w-full h-auto min-h-0 max-h-[85vh] overflow-hidden">
      <div className="flex-shrink-0">
        <FiltersHeader onHide={onHide} />
      </div>

      <div className="flex flex-col gap-4 px-4 overflow-y-auto min-h-0 flex-1">
        <AllFiltersFilterSection
          title="Location"
          attribute="meetingType"
          showSection={showLocation}
          setShowSection={setShowLocation}
          isLocation={true}
          isMeetingType={true}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />
        <AllFiltersFilterSection
          title="Christ Fellowship Campus"
          attribute="campus"
          showSection={showCampus}
          setShowSection={setShowCampus}
          isDropdown={true}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
        <AllFiltersFilterSection
          title="People"
          attribute="people"
          showSection={showPeople}
          setShowSection={setShowPeople}
          isPeopleGroup={true}
          ageInput={ageInput}
          setAgeInput={setAgeInput}
        />
        <AllFiltersFilterSection
          title="Topics"
          attribute="topics"
          isCheckbox={true}
          showSection={showTopics}
          setShowSection={setShowTopics}
          isTopics={true}
        />
        <AllFiltersFilterSection
          title="Meeting Days"
          attribute="meetingDays"
          showSection={showMeetingDays}
          setShowSection={setShowMeetingDays}
        />
        <AllFiltersFilterSection
          title="Meeting Frequency"
          attribute="meetingFrequency"
          showSection={showMeetingFrequency}
          setShowSection={setShowMeetingFrequency}
        />
        <AllFiltersFilterSection
          title="Child Care"
          attribute="adultOnly"
          isCheckbox={true}
          checkboxLayout="horizontal"
          showSection={showChildCare}
          setShowSection={setShowChildCare}
        />
        <AllFiltersFilterSection
          title="Language"
          attribute="language"
          showSection={showLanguage}
          setShowSection={setShowLanguage}
          hideBorder={true}
        />
      </div>

      <div className="flex-shrink-0">
        <FiltersFooter onHide={onHide} onClearAll={clearAllRefinements} />
      </div>
    </div>
  );
};
