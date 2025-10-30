import { useState } from "react";
import { useInstantSearch } from "react-instantsearch";
import { AllFiltersFilterSection } from "~/routes/group-finder/components/filters/filter-section.component";
import { FiltersHeader } from "~/routes/group-finder/components/filters/filters-header.component";
import { FiltersFooter } from "~/routes/group-finder/components/filters/filters-footer.component";

export const AllClassFiltersPopup = ({
  onHide,
  coordinates,
  setCoordinates,
}: {
  onHide: () => void;
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
}) => {
  const [showLocation, setShowLocation] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const { setIndexUiState } = useInstantSearch();

  const clearAllRefinements = () => {
    setSelectedValue("");
    setCoordinates?.({ lat: null, lng: null });
    setShowLocation(false);
    setShowTopics(false);
    setShowLanguage(false);
    setIndexUiState((state) => ({
      ...state,
      refinementList: {},
    }));
  };

  return (
    <div className="bg-white flex flex-col shadow-md w-full md:overflow-y-scroll md:max-h-[85vh]">
      {/* Title Section */}
      <FiltersHeader onHide={onHide} />

      {/* Filters Section */}
      <div className="flex flex-col gap-4 px-4">
        <AllFiltersFilterSection
          title="Location"
          attribute="format"
          showSection={showLocation}
          setShowSection={setShowLocation}
          isLocation={true}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />
        <AllFiltersFilterSection
          title="Topic"
          attribute="topic"
          showSection={showTopics}
          setShowSection={setShowTopics}
          isTopics={true}
        />
        <AllFiltersFilterSection
          title="Language"
          attribute="language"
          showSection={showLanguage}
          setShowSection={setShowLanguage}
          hideBorder={true}
        />
      </div>

      {/* Bottom/Footer Section */}
      <FiltersFooter onHide={onHide} onClearAll={clearAllRefinements} />
    </div>
  );
};
