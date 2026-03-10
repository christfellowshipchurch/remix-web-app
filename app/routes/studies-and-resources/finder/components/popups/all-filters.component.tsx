import { useState } from "react";
import { useInstantSearch } from "react-instantsearch";
import { AllFiltersFilterSection } from "~/routes/group-finder/components/filters/filter-section.component";
import { FiltersHeader } from "~/routes/group-finder/components/filters/filters-header.component";
import { FiltersFooter } from "~/routes/group-finder/components/filters/filters-footer.component";

export const AllStudiesFiltersPopup = ({
  hideTopic = false,
  onHide,
  onClearAllToUrl,
}: {
  hideTopic?: boolean;
  onHide: () => void;
  onClearAllToUrl?: () => void;
}) => {
  const [showDuration, setShowDuration] = useState(false);
  const [showAudience, setShowAudience] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [showTopic, setShowTopic] = useState(false);
  const [showFormat, setShowFormat] = useState(false);

  const { setIndexUiState } = useInstantSearch();

  const clearAllRefinements = () => {
    setIndexUiState((state) => ({
      ...state,
      query: "",
      refinementList: {},
      page: 0,
    }));
    onClearAllToUrl?.();
    setShowDuration(false);
    setShowAudience(false);
    setShowSource(false);
    setShowTopic(false);
    setShowFormat(false);
  };

  return (
    <div className="bg-white flex flex-col shadow-md w-full h-auto min-h-0 max-h-[85vh] md:max-h-none overflow-hidden">
      <div className="shrink-0">
        <FiltersHeader onHide={onHide} />
      </div>

      <div className="flex flex-col gap-4 px-4 overflow-y-auto min-h-0 flex-1">
        <AllFiltersFilterSection
          title="Duration"
          attribute="duration"
          showSection={showDuration}
          setShowSection={setShowDuration}
          hideBorder={false}
        />
        <AllFiltersFilterSection
          title="Audience"
          attribute="audience"
          showSection={showAudience}
          setShowSection={setShowAudience}
          hideBorder={false}
        />
        <AllFiltersFilterSection
          title="Source"
          attribute="source"
          showSection={showSource}
          setShowSection={setShowSource}
          hideBorder={false}
        />
        {!hideTopic && (
          <AllFiltersFilterSection
            title="Topic"
            attribute="topic"
            showSection={showTopic}
            setShowSection={setShowTopic}
            isTopics={true}
            hideBorder={false}
          />
        )}
        <AllFiltersFilterSection
          title="Format"
          attribute="format"
          showSection={showFormat}
          setShowSection={setShowFormat}
          hideBorder
        />
      </div>

      <div className="shrink-0">
        <FiltersFooter onHide={onHide} onClearAll={clearAllRefinements} />
      </div>
    </div>
  );
};
