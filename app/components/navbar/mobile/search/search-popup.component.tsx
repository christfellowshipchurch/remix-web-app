import type { SearchClient } from 'algoliasearch';
import { useCallback, useEffect, useState } from 'react';
import {
  useCurrentRefinements,
  useHits,
  useInstantSearch,
  useSearchBox,
} from 'react-instantsearch';

import type { ContentItemHit } from '~/routes/search/types';

import {
  fetchGlobalSearchLocationHits,
  toMobileLocationContentHit,
} from '../../search-locations';
import {
  MobileContentHit,
  MobileContentHitType,
} from './mobile-content-hit.component';
import { PopularSearches } from './popular-searches.component';

function hasNonBlankUrl(hit: { url?: unknown }): boolean {
  return typeof hit.url === 'string' && hit.url.trim().length > 0;
}

const ContentItemsHitsCollector = ({
  onHitsChange,
}: {
  onHitsChange: (hits: MobileContentHitType[]) => void;
}) => {
  const { items } = useHits<ContentItemHit>();

  useEffect(() => {
    const contentHits: MobileContentHitType[] = items
      .filter(hasNonBlankUrl)
      .map((hit) => ({
        routing: {
          pathname:
            (hit.routing as { pathname?: string })?.pathname ||
            (hit.url as string),
        },
        coverImage:
          (hit.coverImage as MobileContentHitType['coverImage']) || null,
        title: (hit.title as string) || '',
        contentType: (hit.contentType as string) || '',
        summary: (hit.summary as string) || '',
      }));

    onHitsChange(contentHits);
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
  const { items } = useCurrentRefinements();
  const { indexUiState } = useInstantSearch();
  const [contentHits, setContentHits] = useState<MobileContentHitType[]>([]);
  const [locationHits, setLocationHits] = useState<MobileContentHitType[]>([]);

  const selectedItems =
    (indexUiState?.refinementList?.contentType as string[]) || [];
  const isPagesSelected =
    selectedItems.includes('Ministry Page') ||
    selectedItems.includes('Page Builder') ||
    selectedItems.includes('Redirect Card');

  const trimmedQuery = query.trim();
  const isSearching =
    trimmedQuery.length > 0 || items.length > 0 || isPagesSelected;
  const shouldShowLocations = isPagesSelected || trimmedQuery.length > 0;

  const searchLocations = useCallback(
    async (searchQuery: string) => {
      const hits = await fetchGlobalSearchLocationHits({
        searchClient,
        locationsIndexName,
        query: searchQuery,
      });

      return hits.map(toMobileLocationContentHit);
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
    <div className='size-full p-4 pt-0! md:p-6 md:pt-6!'>
      <ContentItemsHitsCollector onHitsChange={setContentHits} />

      <div className='border-t border-[#E0E0E0] pt-6 space-y-4'>
        {isSearching ? (
          <div className='grid md:grid-cols-1 gap-4'>
            {combinedHits.map((hit, index) => (
              <div
                key={`${hit.routing.pathname}-${index}`}
                className='flex'
                onClick={() => setIsSearchOpen(false)}
              >
                <MobileContentHit hit={hit} />
              </div>
            ))}
          </div>
        ) : (
          <PopularSearches onNavigate={() => setIsSearchOpen(false)} />
        )}
      </div>
    </div>
  );
};
