import { useState } from "react";
import { useInstantSearch } from "react-instantsearch";

import { MobileFilterBottomSheet } from "~/components/finders/search-filters/filter-popup.component";
import { hasInstantSearchIndexUiActiveFilters } from "~/lib/algolia-active-filters";
import { AllFiltersFilterSection } from "~/routes/group-finder/components/filters/filter-section.component";
import { FiltersHeader } from "~/routes/group-finder/components/filters/filters-header.component";
import { FiltersFooter } from "~/routes/group-finder/components/filters/filters-footer.component";

export const AllClassFiltersPopup = ({
  hideTopic = false,
  hideLanguage = false,
  showFormat = false,
  onHide,
  onClearAllToUrl,
  mobileBottomSheet = false,
  bottomSheetTitle = "More",
}: {
  hideTopic?: boolean;
  hideLanguage?: boolean;
  /** Collapsible Format (Algolia `format` facet, meeting-type chips). */
  showFormat?: boolean;
  onHide: () => void;
  onClearAllToUrl?: () => void;
  mobileBottomSheet?: boolean;
  bottomSheetTitle?: string;
}) => {
  const [showTopics, setShowTopics] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showFormatSection, setShowFormatSection] = useState(false);

  const { setIndexUiState, indexUiState } = useInstantSearch();

  const clearAllDisabled = !hasInstantSearchIndexUiActiveFilters(indexUiState);

  const clearAllRefinements = () => {
    setIndexUiState((state) => ({
      ...state,
      query: "",
      refinementList: {},
      page: 0,
    }));
    onClearAllToUrl?.();
    setShowTopics(false);
    setShowLanguage(false);
  };

  const sections = (
    <>
      {!hideTopic && (
        <AllFiltersFilterSection
          title="Topic"
          attribute="topic"
          showSection={showTopics}
          setShowSection={setShowTopics}
          isTopics={true}
          hideBorder={hideLanguage && !showFormat}
        />
      )}

      {!hideLanguage && (
        <AllFiltersFilterSection
          title="Language"
          attribute="language"
          showSection={showLanguage}
          setShowSection={setShowLanguage}
          hideBorder={!showFormat}
        />
      )}

      {showFormat ? (
        <AllFiltersFilterSection
          title="Format"
          attribute="format"
          showSection={showFormatSection}
          setShowSection={setShowFormatSection}
          isMeetingType={true}
          hideBorder
        />
      ) : null}
    </>
  );

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
          <div className="flex min-h-0 flex-col gap-4 px-4 pt-1">{sections}</div>
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
        {sections}
      </div>

      <div className="shrink-0">{footer}</div>
    </div>
  );
};
