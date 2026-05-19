import { useHits, useInstantSearch } from 'react-instantsearch';

export function useHydratedHitsFallback<THit>({
  initialHits,
}: {
  initialHits: THit[];
}) {
  const { items } = useHits();
  const { status } = useInstantSearch();
  const isLoading = status === 'loading' || status === 'stalled';

  // The server loader already rendered real cards for first paint. When
  // InstantSearch has just mounted and is still fetching its first client-side
  // response, keep showing those loader hits instead of briefly flashing an
  // empty grid. Once Algolia returns items, the client-side results take over.
  const hits =
    isLoading && items.length === 0 ? initialHits : (items as THit[]);

  return {
    hits,
    isLoading,
  };
}
