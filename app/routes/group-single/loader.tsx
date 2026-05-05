import { LoaderFunctionArgs } from 'react-router-dom';
import { AuthenticationError } from '~/lib/.server/error-types';
import { algoliasearch } from 'algoliasearch';
import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';
import { GroupType, GROUPS_ALGOLIA_INDEX_NAME } from '../group-finder/types';

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  groupGuid: string;
  group: GroupType | null;
};

export function normalizeGroupGuid(value: string): string {
  return value.trim().toUpperCase();
}

async function fetchGroupWithFilter(
  filters: string,
  appId: string,
  apiKey: string,
): Promise<GroupType | null> {
  try {
    const searchClient = algoliasearch(appId, apiKey);

    const response = await searchClient.searchForHits<Record<string, unknown>>([
      {
        indexName: GROUPS_ALGOLIA_INDEX_NAME,
        params: {
          filters,
          hitsPerPage: 1,
        },
      },
    ]);

    const hit = response.results[0]?.hits?.[0];
    if (!hit) {
      return null;
    }

    return hit as unknown as GroupType;
  } catch (error) {
    console.error('Failed to fetch group from Algolia:', error);
    return null;
  }
}

/**
 * Resolve by `groupGuid` without relying on Algolia facet filters (see volunteer
 * `VolunteerMissionSpotsAlgoliaProvider`: query + exact GUID match).
 */
async function fetchGroupByGuidSearch(
  segment: string,
  appId: string,
  apiKey: string,
): Promise<GroupType | null> {
  const trimmed = segment.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const searchClient = algoliasearch(appId, apiKey);
    const want = normalizeGroupGuid(trimmed);

    const response = await searchClient.searchForHits<Record<string, unknown>>([
      {
        indexName: GROUPS_ALGOLIA_INDEX_NAME,
        params: {
          query: trimmed,
          hitsPerPage: 50,
        },
      },
    ]);

    const hits = response.results[0]?.hits ?? [];
    for (const hit of hits) {
      const raw = hit.groupGuid as string | undefined;
      if (typeof raw === 'string' && normalizeGroupGuid(raw) === want) {
        return hit as unknown as GroupType;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to search group by GUID in Algolia:', error);
    return null;
  }
}

async function fetchGroupByPathSegment(
  segment: string,
  appId: string,
  apiKey: string,
): Promise<GroupType | null> {
  const escaped = escapeAlgoliaFilterString(segment);

  /** Legacy URLs used Algolia `objectID` in the path (`objectID` is always filterable). */
  const byObjectId = await fetchGroupWithFilter(
    `groupGuid:${escaped}`,
    appId,
    apiKey,
  );
  if (byObjectId) {
    return byObjectId;
  }

  return fetchGroupByGuidSearch(segment, appId, apiKey);
}

export async function loader({ params }: LoaderFunctionArgs) {
  const groupGuid = params.path || '';

  if (!groupGuid) {
    throw new Error('Group not found');
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  const group = await fetchGroupByPathSegment(groupGuid, appId, searchApiKey);

  return Response.json({
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    groupGuid,
    group,
  });
}
