import { LoaderFunctionArgs } from 'react-router-dom';
import { algoliasearch } from 'algoliasearch';
import { AuthenticationError } from '~/lib/.server/error-types';
import type { StudyHitType } from '../types';

const STUDIES_ALGOLIA_INDEX_NAME = 'dev_StudiesAndResources';

export type LoaderReturnType = {
  studyUrl: string;
  studyHit: StudyHitType | null;
};

async function fetchStudyHitForPath(
  studyUrl: string,
  appId: string,
  apiKey: string,
): Promise<StudyHitType | null> {
  try {
    const client = algoliasearch(appId, apiKey);
    const response = await client.searchForHits<Record<string, unknown>>([
      {
        indexName: STUDIES_ALGOLIA_INDEX_NAME,
        params: {
          query: studyUrl,
          hitsPerPage: 50,
          typoTolerance: false,
          restrictSearchableAttributes: ['url'],
          removeWordsIfNoResults: 'none',
        },
      },
    ]);

    const hits = response.results[0]?.hits ?? [];

    for (const raw of hits) {
      const recordUrl = typeof raw.url === 'string' ? raw.url.trim() : '';
      if (recordUrl === studyUrl) {
        return raw as unknown as StudyHitType;
      }
    }
    return null;
  } catch (error) {
    console.error('Studies single: Algolia lookup failed:', error);
    return null;
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  const studyUrl = (params.path ?? '').trim();

  if (!studyUrl) {
    throw new Error('Study not found');
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  const studyHit = await fetchStudyHitForPath(studyUrl, appId, searchApiKey);

  return {
    studyUrl,
    studyHit,
  };
}
