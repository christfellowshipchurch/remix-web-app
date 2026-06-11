import { LoaderFunctionArgs } from 'react-router-dom';
import { algoliasearch } from 'algoliasearch';
import { AuthenticationError } from '~/lib/.server/error-types';
import { fetchRockData } from '~/lib/.server/fetch-rock-data';
import { fetchWistiaDataFromRock } from '~/lib/.server/fetch-wistia-data';
import { getAttributeMatrixItems } from '~/lib/.server/rock-utils';
import { parseRockKeyValueList, parseRockValueList } from '~/lib/utils';
import type {
  CurriculumSession,
  StudyCallToAction,
  StudyHitType,
} from '../types';

const STUDIES_ALGOLIA_INDEX_NAME = 'dev_StudiesAndResources';

export type LoaderReturnType = {
  studyUrl: string;
  studyHit: StudyHitType | null;
  curriculum: CurriculumSession[];
  callsToAction: StudyCallToAction[];
  trailerWistiaId: string | null;
};

/** Rock stores resource types in all caps (e.g. "DISCUSSION GUIDE") */
const formatResourceType = (type: string) =>
  type
    .toLowerCase()
    .replace(/(^|\s)\w/g, (character) => character.toUpperCase());

async function fetchStudyRockData(rockItemId: number): Promise<{
  curriculum: CurriculumSession[];
  callsToAction: StudyCallToAction[];
  trailerWistiaId: string | null;
}> {
  const empty = { curriculum: [], callsToAction: [], trailerWistiaId: null };
  const id = Number(rockItemId);
  if (!Number.isFinite(id)) {
    console.warn(`Studies single: invalid Rock item id: ${rockItemId}`);
    return empty;
  }

  try {
    const studyItem = await fetchRockData({
      endpoint: 'ContentChannelItems',
      queryParams: {
        $filter: `Id eq ${id}`,
        loadAttributes: 'simple',
      },
    });

    if (!studyItem) {
      return empty;
    }

    const callsToAction = parseRockKeyValueList(
      studyItem.attributeValues?.calltoActions?.value || '',
    ).map((cta) => ({ title: cta.key, url: cta.value }));

    const sessionTitles = parseRockValueList(
      studyItem.attributeValues?.sessionTitles?.value || '',
    );

    const resourceMatrixGuid =
      studyItem.attributeValues?.resourceItems?.value || '';
    const matrixItems = resourceMatrixGuid
      ? await getAttributeMatrixItems({
          attributeMatrixGuid: resourceMatrixGuid,
        })
      : [];

    const resources = await Promise.all(
      matrixItems.map(async (item) => {
        let wistiaId: string | undefined;
        const mediaGuid = item.attributeValues?.video?.value;
        if (mediaGuid) {
          try {
            const mediaElement = await fetchWistiaDataFromRock(mediaGuid);
            wistiaId = mediaElement?.sourceKey || undefined;
          } catch (error) {
            console.error('Studies single: error fetching Wistia data:', error);
          }
        }

        return {
          title: item.attributeValues?.title?.value || '',
          type: formatResourceType(
            item.attributeValues?.type?.valueFormatted ||
              item.attributeValues?.type?.value ||
              '',
          ),
          url: item.attributeValues?.url?.value || undefined,
          wistiaId,
          sessionNumber: Number(item.attributeValues?.sessionNumber?.value),
        };
      }),
    );

    const orphanedCount = resources.filter(
      (resource) =>
        !(
          resource.sessionNumber >= 1 &&
          resource.sessionNumber <= sessionTitles.length
        ),
    ).length;
    if (orphanedCount > 0) {
      console.warn(
        `Studies single: dropped ${orphanedCount} resource(s) with a session number outside the SessionTitles list`,
      );
    }

    const curriculum = sessionTitles.map((title, index) => ({
      title,
      resources: resources
        .filter((resource) => resource.sessionNumber === index + 1)
        .map(({ sessionNumber: _sessionNumber, ...resource }) => resource),
    }));

    let trailerWistiaId: string | null = null;
    const trailerMediaGuid = studyItem.attributeValues?.trailerVideo?.value;
    if (trailerMediaGuid) {
      try {
        const mediaElement = await fetchWistiaDataFromRock(trailerMediaGuid);
        trailerWistiaId = mediaElement?.sourceKey || null;
      } catch (error) {
        console.error(
          'Studies single: error fetching trailer Wistia data:',
          error,
        );
      }
    }

    return { curriculum, callsToAction, trailerWistiaId };
  } catch (error) {
    console.error('Studies single: Rock data fetch failed:', error);
    return empty;
  }
}

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

  const { curriculum, callsToAction, trailerWistiaId } =
    studyHit?.rockItemId != null
      ? await fetchStudyRockData(studyHit.rockItemId)
      : { curriculum: [], callsToAction: [], trailerWistiaId: null };

  return {
    studyUrl,
    studyHit,
    curriculum,
    callsToAction,
    trailerWistiaId,
  };
}
