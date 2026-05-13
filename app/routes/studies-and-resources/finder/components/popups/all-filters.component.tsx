import { useState } from 'react';
import { useInstantSearch } from 'react-instantsearch';

import { MobileFilterBottomSheet } from '~/components/finders/search-filters/filter-popup.component';
import { hasInstantSearchIndexUiActiveFilters } from '~/lib/algolia-active-filters';
import { AllFiltersFilterSection } from '~/routes/group-finder/components/filters/filter-section.component';
import { FiltersHeader } from '~/routes/group-finder/components/filters/filters-header.component';
import { FiltersFooter } from '~/routes/group-finder/components/filters/filters-footer.component';

export const AllStudiesFiltersPopup = ({
  hideTopic = false,
  onHide,
  onClearAllToUrl,
  mobileBottomSheet = false,
  bottomSheetTitle = 'All filters',
}: {
  hideTopic?: boolean;
  onHide: () => void;
  onClearAllToUrl?: () => void;
  mobileBottomSheet?: boolean;
  bottomSheetTitle?: string;
}) => {
  const [showDuration, setShowDuration] = useState(false);
  const [showAudience, setShowAudience] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [showTopic, setShowTopic] = useState(false);
  const [showFormat, setShowFormat] = useState(false);

  const { setIndexUiState, indexUiState } = useInstantSearch();

  const clearAllDisabled = !hasInstantSearchIndexUiActiveFilters(indexUiState);

  const clearAllRefinements = () => {
    setIndexUiState((state) => ({
      ...state,
      query: '',
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

  const expandAlways = mobileBottomSheet;

  const sections = (
    <>
      <AllFiltersFilterSection
        title='Duration'
        attribute='duration'
        showSection={showDuration}
        setShowSection={setShowDuration}
        hideBorder={false}
        expandAlways={expandAlways}
      />
      <AllFiltersFilterSection
        title='Audience'
        attribute='audience'
        showSection={showAudience}
        setShowSection={setShowAudience}
        hideBorder={false}
        expandAlways={expandAlways}
      />
      <AllFiltersFilterSection
        title='Source'
        attribute='source'
        showSection={showSource}
        setShowSection={setShowSource}
        hideBorder={false}
        expandAlways={expandAlways}
      />
      {!hideTopic ? (
        <AllFiltersFilterSection
          title='Topic'
          attribute='topic'
          showSection={showTopic}
          setShowSection={setShowTopic}
          hideBorder={false}
          expandAlways={expandAlways}
        />
      ) : null}
      <AllFiltersFilterSection
        title='Format'
        attribute='format'
        showSection={showFormat}
        setShowSection={setShowFormat}
        hideBorder
        expandAlways={expandAlways}
      />
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
          <div className='flex min-h-0 flex-col gap-6 px-4 pb-4 pt-1'>
            {sections}
          </div>
        }
        footer={
          <div className='min-w-0 shrink-0 bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_36px_-12px_rgba(15,23,42,0.14)]'>
            {footer}
          </div>
        }
      />
    );
  }

  return (
    <div className='flex h-auto min-h-0 w-full max-h-[85vh] flex-col overflow-hidden bg-white shadow-md md:max-h-none'>
      <div className='shrink-0'>
        <FiltersHeader onHide={onHide} />
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto px-4'>
        <div className='flex flex-col gap-4 py-1'>{sections}</div>
      </div>

      <div className='shrink-0'>{footer}</div>
    </div>
  );
};
