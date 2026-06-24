import type { SearchClient } from 'algoliasearch';
import { useCallback, useEffect, useState } from 'react';
import { useHits, useInstantSearch, useSearchBox } from 'react-instantsearch';

import type { ContentItemHit } from '~/routes/search/types';

import {
  fetchGlobalSearchLocationHits,
  toDesktopLocationContentHit,
} from '../../search-locations';
import { ContentHit } from './content-hit.component';
import { SearchCustomRefinementList } from './custom-refinements.component';

function hasNonBlankUrl(hit: { url?: unknown }): boolean {
  return typeof hit.url === 'string' && hit.url.trim().length > 0;
}

const ContentItemsHitsCollector = ({
  onHitsChange,
}: {
  onHitsChange: (hits: ContentItemHit[]) => void;
}) => {
  const { items } = useHits<ContentItemHit>();

  useEffect(() => {
    onHitsChange(items.filter(hasNonBlankUrl));
  }, [items, onHitsChange]);

  return null;
};

export const SearchPopup = ({
  setIsSearchOpen,
  searchClient,
  locationsIndexName,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
  searchClient: SearchClient | { search: () => Promise<unknown> };
  locationsIndexName: string;
}) => {
  const { query } = useSearchBox();
  const { indexUiState } = useInstantSearch();
  const [contentHits, setContentHits] = useState<ContentItemHit[]>([]);
  const [locationHits, setLocationHits] = useState<ContentItemHit[]>([]);

  const selectedItems =
    (indexUiState?.refinementList?.contentType as string[]) || [];
  const isPagesSelected =
    selectedItems.includes('Ministry Page') ||
    selectedItems.includes('Page Builder') ||
    selectedItems.includes('Redirect Card');

  const trimmedQuery = query.trim();
  const shouldShowLocations = trimmedQuery.length > 0 || isPagesSelected;

  const searchLocations = useCallback(
    async (searchQuery: string) => {
      const hits = await fetchGlobalSearchLocationHits({
        searchClient,
        locationsIndexName,
        query: searchQuery,
      });

      return hits.map(toDesktopLocationContentHit);
    },
    [locationsIndexName, searchClient],
  );

  useEffect(() => {
    if (!shouldShowLocations) {
      setLocationHits([]);
      return;
    }

    let isCancelled = false;

    void searchLocations(trimmedQuery)
      .then((hits) => {
        if (!isCancelled) {
          setLocationHits(hits);
        }
      })
      .catch((error) => {
        console.error('Error searching locations:', error);
        if (!isCancelled) {
          setLocationHits([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [shouldShowLocations, trimmedQuery, searchLocations]);

  const combinedHits = shouldShowLocations
    ? [...contentHits, ...locationHits]
    : contentHits;

  return (
    <div className='absolute left-0 top-[52px] w-full bg-gray rounded-b-lg shadow-lg px-12 z-4 popup-search-container transition-all duration-800 ease-in-out max-h-0 overflow-hidden'>
      <div className='flex items-center gap-2 pb-4'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-xs text-[#2F2F2F] opacity-50 font-semibold'>
            I'M LOOKING FOR
          </h2>
          <SearchCustomRefinementList attribute='contentType' />
        </div>
      </div>

      <ContentItemsHitsCollector onHitsChange={setContentHits} />

      <div className='mt-2 space-y-4'>
        <div className='flex flex-col overflow-y-scroll max-h-[300px] scrollbar-thin [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-neutral-default/60 [&::-webkit-scrollbar-track]:bg-gray'>
          {combinedHits.map((hit) => (
            <div
              key={hit.objectID}
              onClick={() => setIsSearchOpen(false)}
              className='flex w-full'
            >
              <ContentHit hit={hit} query={query || null} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
