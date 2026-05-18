import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from 'react-router-dom';
import { InstantSearch, SearchBox } from 'react-instantsearch';

import Icon from '~/primitives/icon';

import { LoaderReturnType } from '../loader';
import { ClassHitComponent } from '../components/class-hit-component.component';
import { AllClassFiltersPopup } from '../components/all-filters.component';
import { buildIndexInitialUiState } from '~/components/finders/finder-algolia.utils';
import { FinderResultsStats } from '~/components/finders/finder-results-stats.component';
import { FinderStickyBar } from '~/components/finders/finder-sticky-bar.component';
import {
  SearchFilterDesktopItem,
  SearchFilters,
} from '~/components/finders/search-filters';
import { ActiveFilters } from '~/components/finders/search-filters/active-filter.component';
import { ClassHitType } from '../../types';
import { cn } from '~/lib/utils';

import {
  groupClassTypeHits,
  syntheticHitsFromGrouped,
} from '../components/group-class-type-hits';
import { useAlgoliaUrlSync } from '~/hooks/use-algolia-url-sync';
import { useScrollToSearchResultsOnLoad } from '~/hooks/use-scroll-to-search-results-on-load';
import { HubsTagsRefinementList } from '~/components/hubs-tags-refinement';
import {
  classFinderEmptyState,
  ClassFinderUrlState,
  classFinderUrlStateToParams,
  parseClassFinderUrlState,
} from '../components/class-finder-url-state';
import { CLASSES_ALGOLIA_INDEX_NAME } from '../components/build-class-finder-algolia-search';
import { createClassFinderLoaderSearchClient } from '../components/create-class-finder-loader-search-client';
import { ClassFinderFiltersSkeleton } from '../components/filters/class-finder-filters-skeleton.component';

/**
 * Class finder data flow:
 * 1. Route loader reads URL → Algolia on the server → `classHits` + `classFacets`.
 * 2. Results grid renders from loader hits (outside `<InstantSearch>`) for fast first paint.
 * 3. InstantSearch + loader-backed SearchClient only powers filter widgets and URL sync.
 * 4. Grouping + 12-per-page pagination stay client-side (same as before; loader returns up to 1000 raw hits).
 * 5. `filtersMounted` defers InstantSearch until after hydration so the results grid is not blocked.
 */

const CLASS_SEARCH_DESKTOP_FILTERS = [
  {
    id: 'topic',
    label: 'Topic',
    popupTitle: 'Topic',
    icon: 'bookOpen',
    data: {
      showFooter: true,
      content: [
        {
          title: 'LEARN ABOUT',
          attribute: 'topic',
        },
      ],
    },
  },
] satisfies SearchFilterDesktopItem[];

function getInitialStateFromUrl(searchParams: URLSearchParams) {
  const urlState = parseClassFinderUrlState(searchParams);
  return {
    initialUiState:
      buildIndexInitialUiState(CLASSES_ALGOLIA_INDEX_NAME, urlState) ?? {},
  };
}

export const ClassSearch = () => {
  const loaderData = useLoaderData<LoaderReturnType>();
  const { classHits } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigation = useNavigation();

  const { debouncedUpdateUrl, cancelDebounce } = useAlgoliaUrlSync({
    searchParams,
    setSearchParams,
    toParams: classFinderUrlStateToParams,
    debounceMs: 400,
  });

  const initial = useMemo(() => getInitialStateFromUrl(searchParams), []);

  const searchClient = useMemo(
    () => createClassFinderLoaderSearchClient(loaderData),
    [loaderData],
  );

  const isLoading =
    navigation.state === 'loading' &&
    navigation.location?.pathname === location.pathname;

  const clearAllFiltersFromUrl = () => {
    cancelDebounce();
    setSearchParams(classFinderUrlStateToParams(classFinderEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
  };

  const syncUrlFromUiState = (indexUiState: Record<string, unknown>) => {
    const urlState: ClassFinderUrlState = {
      ...parseClassFinderUrlState(searchParams),
      query: (indexUiState.query as string) ?? undefined,
      refinementList:
        (indexUiState.refinementList as Record<string, string[]>) ?? undefined,
    };
    debouncedUpdateUrl(urlState);
  };

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseClassFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const fromClassFinderUrl =
    location.pathname +
    (searchParams.toString() ? `?${searchParams.toString()}` : '');

  /** SSR/hydration: skeleton filters until react-instantsearch mounts (same pattern as group finder). */
  const [filtersMounted, setFiltersMounted] = useState(false);
  useEffect(() => {
    setFiltersMounted(true);
  }, []);

  return (
    <div
      className='flex w-full min-w-0 max-w-full flex-col gap-4 pagination-scroll-to'
      id='search'
    >
      <div className='flex flex-col bg-white pt-4'>
        <FinderStickyBar>
          {filtersMounted ? (
            <InstantSearch
            indexName={CLASSES_ALGOLIA_INDEX_NAME}
            searchClient={searchClient}
            initialUiState={
              Object.keys(initial.initialUiState).length > 0
                ? initial.initialUiState
                : undefined
            }
            onStateChange={({ uiState, setUiState }) => {
              setUiState(uiState);
              const indexState = uiState[CLASSES_ALGOLIA_INDEX_NAME];
              if (indexState) {
                syncUrlFromUiState(indexState as Record<string, unknown>);
              }
            }}
            future={{
              preserveSharedStateOnUnmount: true,
            }}
          >
            <div className='mx-auto flex max-w-screen-content flex-col gap-3 py-4 md:flex-row md:items-center md:gap-4'>
              <div className='w-full md:w-[240px] lg:w-[250px] xl:w-[266px] flex items-center rounded-lg border border-[#DEE0E3] focus-within:border-ocean py-2'>
                <Icon
                  name='searchAlt'
                  className='text-neutral-default ml-3'
                  size={16}
                />
                <SearchBox
                  placeholder='Search'
                  translations={{
                    submitButtonTitle: 'Search',
                    resetButtonTitle: 'Reset',
                  }}
                  classNames={{
                    root: 'flex-grow',
                    form: 'flex',
                    input:
                      'w-full text-base text-neutral-default placeholder:text-neutral-default px-2 py-1 focus:outline-none md:text-sm',
                    resetIcon: 'hidden',
                    submit: 'hidden',
                    loadingIcon: 'hidden',
                  }}
                />
              </div>

              <div className='lg:hidden w-full'>
                <SearchFilters
                  onClearAllToUrl={clearAllFiltersFromUrl}
                  desktopFilters={CLASS_SEARCH_DESKTOP_FILTERS}
                  compactInlineFilterCount={2}
                  groupedFooterCount
                  renderMorePanel={({
                    onHide,
                    onClearAllToUrl,
                    mobileBottomSheet,
                    morePanelTitle,
                  }) => (
                    <AllClassFiltersPopup
                      hideTopic
                      hideLanguage
                      showFormat
                      onHide={onHide}
                      onClearAllToUrl={onClearAllToUrl}
                      mobileBottomSheet={mobileBottomSheet}
                      bottomSheetTitle={morePanelTitle}
                    />
                  )}
                />
              </div>

              <div className='hidden min-w-0 flex-1 lg:block'>
                <HubsTagsRefinementList
                  attribute='topic'
                  wrapperClass='flex min-w-0 flex-nowrap gap-2 overflow-x-auto py-1 scrollbar-hide md:gap-3'
                />
              </div>
            </div>
            <ActiveFilters onClearAllToUrl={clearAllFiltersFromUrl} />
            </InstantSearch>
          ) : (
            <div className='mx-auto flex max-w-screen-content flex-col gap-3 py-4 md:flex-row md:items-center md:gap-4'>
              <div
                className='h-[42px] w-full animate-pulse rounded-lg bg-neutral-200 md:w-[240px] lg:w-[250px] xl:w-[266px]'
                aria-hidden
              />
              <ClassFinderFiltersSkeleton />
            </div>
          )}
        </FinderStickyBar>

        <div className='flex flex-col bg-gray py-8 md:pt-12 md:pb-20 w-full content-padding'>
          <div className='max-w-screen-content mx-auto md:w-full'>
            <ClassTypeGroupedResults
              hits={classHits}
              isLoading={isLoading}
              fromClassFinderUrl={fromClassFinderUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ITEMS_PER_PAGE = 12;

function ClassTypeGroupedResults({
  hits,
  isLoading,
  fromClassFinderUrl,
}: {
  hits: ClassHitType[];
  isLoading: boolean;
  fromClassFinderUrl?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const grouped = useMemo(() => groupClassTypeHits(hits), [hits]);
  const mappedHits = useMemo(
    () => syntheticHitsFromGrouped(grouped),
    [grouped],
  );

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageHits = mappedHits.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [mappedHits.length]);

  return (
    <>
      <div
        className={cn('min-h-[320px] transition-opacity', {
          'opacity-50 pointer-events-none': isLoading,
        })}
      >
        <FinderResultsStats hitCount={mappedHits.length} />

        <div className='flex w-full items-center justify-center md:items-start md:justify-start'>
          <div className='grid w-full max-w-[900px] items-stretch lg:max-w-[1296px] gap-y-6 sm:gap-x-8 md:gap-y-8 lg:gap-x-4 lg:gap-y-16 xl:gap-x-8! grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {pageHits.map((hit) => (
              <ClassHitComponent
                key={hit.objectID}
                hit={hit}
                fromClassFinderUrl={fromClassFinderUrl}
              />
            ))}
          </div>
        </div>
      </div>

      <ClassSearchPagination
        totalItems={mappedHits.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

function ClassSearchPagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const goToPage = (newPage: number) => {
    onPageChange(newPage);
    document
      .querySelector('.pagination-scroll-to')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  if (totalPages <= 1) return null;

  return (
    <div className='mt-6 flex justify-center md:justify-start'>
      <div className='flex items-center justify-center gap-2'>
        <PaginationControl
          disabled={isFirstPage}
          onClick={() => goToPage(currentPage - 1)}
        >
          <Icon
            name='chevronLeft'
            size={32}
            color={isFirstPage ? '#CECECE' : '#0092BC'}
          />
        </PaginationControl>
        <p>
          {currentPage} of {totalPages}
        </p>
        <PaginationControl
          disabled={isLastPage}
          onClick={() => goToPage(currentPage + 1)}
        >
          <Icon
            name='chevronRight'
            size={32}
            color={isLastPage ? '#CECECE' : '#0092BC'}
          />
        </PaginationControl>
      </div>
    </div>
  );
}

function PaginationControl({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <div>
        <span>{children}</span>
      </div>
    );
  }

  return (
    <div>
      <button type='button' onClick={onClick} className='cursor-pointer'>
        {children}
      </button>
    </div>
  );
}
