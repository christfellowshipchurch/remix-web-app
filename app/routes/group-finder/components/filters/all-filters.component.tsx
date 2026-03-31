import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInstantSearch } from "react-instantsearch";

import { MobileFilterBottomSheet } from "~/components/finders/search-filters/filter-popup.component";
import { hasInstantSearchIndexUiActiveFilters } from "~/lib/algolia-active-filters";
import {
  parseGroupFinderUrlState,
  hasGroupFinderNonInstantSearchFilters,
} from "../../group-finder-url-state";
import { AllFiltersFilterSection } from "./filter-section.component";
import { FiltersHeader } from "./filters-header.component";
import { FiltersFooter } from "./filters-footer.component";

export const AllGroupFiltersPopup = ({
  onHide,
  ageInput,
  setAgeInput,
  coordinates,
  setCoordinates,
  onLocationKind,
  onClearAllToUrl,
  mobileBottomSheet = false,
  bottomSheetTitle = "More",
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
    } | null,
  ) => void;
  onLocationKind: (kind: "zip" | "gps" | null) => void;
  onClearAllToUrl?: () => void;
  mobileBottomSheet?: boolean;
  bottomSheetTitle?: string;
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

  const [searchParams] = useSearchParams();
  const { setIndexUiState, indexUiState } = useInstantSearch();

  const clearAllDisabled = !(
    hasInstantSearchIndexUiActiveFilters(indexUiState) ||
    hasGroupFinderNonInstantSearchFilters(
      parseGroupFinderUrlState(searchParams),
      coordinates,
    )
  );

  const clearAllRefinements = () => {
    onClearAllToUrl?.();
    setIndexUiState((state) => ({
      ...state,
      query: "",
      refinementList: {},
      page: 0,
    }));
    setSelectedValue("");
    setCoordinates?.({ lat: null, lng: null });
    setAgeInput?.("");
    setShowLocation(false);
    setShowCampus(false);
    setShowTopics(false);
    setShowPeople(false);
    setShowMeetingDays(false);
    setShowMeetingFrequency(false);
    setShowChildCare(false);
    setShowLanguage(false);
  };

  /** Location / campus / people are inline pills on narrow mobile; omit from the overflow sheet only. */
  const moreSheetOnlySections = (
    <>
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
    </>
  );

  const sections = (
    <>
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
        onLocationKind={onLocationKind}
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
      {moreSheetOnlySections}
    </>
  );

  const scrollableSections = mobileBottomSheet ? moreSheetOnlySections : sections;

  const footer = (
    <FiltersFooter
      onHide={onHide}
      onClearAll={clearAllRefinements}
      clearAllDisabled={clearAllDisabled}
    />
  );

  if (mobileBottomSheet) {
    return (
      <MobileFilterBottomSheet
        title={bottomSheetTitle}
        onClose={onHide}
        scrollable={
          <div className="flex min-h-0 flex-col gap-4 px-4 pt-1">
            {scrollableSections}
          </div>
        }
        footer={
          <div className="min-w-0 shrink-0 border-t border-black/10 bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_36px_-12px_rgba(15,23,42,0.14)]">
            {footer}
          </div>
        }
      />
    );
  }

  return (
    <div className="flex h-auto min-h-0 w-full max-h-[85vh] flex-col overflow-hidden bg-white shadow-md md:max-h-none">
      <div className="shrink-0">
        <FiltersHeader onHide={onHide} />
      </div>

      <div className="min-h-0 flex-1 flex flex-col gap-4 overflow-y-auto px-4">
        {scrollableSections}
      </div>

      <div className="flex-shrink-0">{footer}</div>
    </div>
  );
};
