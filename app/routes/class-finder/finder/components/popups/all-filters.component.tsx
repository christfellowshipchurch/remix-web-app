import { useState } from "react";
import { useInstantSearch } from "react-instantsearch";
import { AllFiltersFilterSection } from "~/routes/group-finder/components/filters/filter-section.component";
import { FiltersHeader } from "~/routes/group-finder/components/filters/filters-header.component";
import { FiltersFooter } from "~/routes/group-finder/components/filters/filters-footer.component";

export const AllClassFiltersPopup = ({
  hideTopic = false,
  onHide,
  coordinates,
  setCoordinates,
  onClearAllToUrl,
}: {
  hideTopic?: boolean;
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
  onClearAllToUrl?: () => void;
}) => {
  const [showLocation, setShowLocation] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
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
    setShowLocation(false);
    setShowTopics(false);
    setShowLanguage(false);
  };

  return (
    <div className="bg-white flex flex-col shadow-md w-full h-auto min-h-0 max-h-[85vh] md:max-h-none overflow-hidden">
      <div className="flex-shrink-0">
        <FiltersHeader onHide={onHide} />
      </div>

      <div className="flex flex-col gap-4 px-4 overflow-y-auto min-h-0 flex-1">
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

        {!hideTopic && (
          <AllFiltersFilterSection
            title="Topic"
            attribute="topic"
            showSection={showTopics}
            setShowSection={setShowTopics}
            isTopics={true}
          />
        )}

        <AllFiltersFilterSection
          title="Language"
          attribute="language"
          showSection={showLanguage}
          setShowSection={setShowLanguage}
        />
      </div>

      <div className="flex-shrink-0">
        <FiltersFooter onHide={onHide} onClearAll={clearAllRefinements} />
      </div>
    </div>
  );
};
