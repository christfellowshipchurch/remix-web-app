import { useMemo, type ReactNode } from 'react';
import { Configure, InstantSearch, useHits } from 'react-instantsearch';

import { createSearchClient } from '~/lib/create-search-client';

import type { Volunteer } from '../../types';

function normalizeGroupGuid(value: string): string {
  return value.trim().toUpperCase();
}

function spotsLeftToLabel(spotsLeft: unknown): string | null {
  if (spotsLeft === undefined || spotsLeft === null) return null;
  const s = String(spotsLeft).trim();
  if (!s.length) return null;
  return `${s} spots left`;
}

function SpotsFromHits({
  groupGuid,
  rockFallback,
  children,
}: {
  groupGuid: string;
  rockFallback: string | null;
  children: (spotsLabel: string | null) => ReactNode;
}) {
  const { items } = useHits<Volunteer>();
  const want = normalizeGroupGuid(groupGuid);
  const hit = items.find((h) => normalizeGroupGuid(h.groupGuid ?? '') === want);
  const fromAlgolia = hit ? spotsLeftToLabel(hit.spotsLeft) : null;
  return <>{children(fromAlgolia ?? rockFallback)}</>;
}

/**
 * Scoped InstantSearch for `spotsLeft` only (missions index, GUID query + exact match).
 * Rock `mission` remains the source of truth for the page; Algolia supplements spots when indexed.
 */
export function VolunteerMissionSpotsAlgoliaProvider({
  appId,
  searchApiKey,
  indexName,
  groupGuid,
  rockFallback,
  children,
}: {
  appId: string;
  searchApiKey: string;
  indexName: string;
  groupGuid: string;
  rockFallback: string | null;
  children: (spotsLabel: string | null) => ReactNode;
}) {
  const searchClient = useMemo(
    () => createSearchClient(appId, searchApiKey),
    [appId, searchApiKey],
  );

  if (!appId.trim() || !searchApiKey.trim()) {
    return <>{children(rockFallback)}</>;
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      key={groupGuid}
    >
      <Configure query={groupGuid} hitsPerPage={50} />
      <SpotsFromHits groupGuid={groupGuid} rockFallback={rockFallback}>
        {children}
      </SpotsFromHits>
    </InstantSearch>
  );
}
