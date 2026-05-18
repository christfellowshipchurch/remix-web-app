import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';
import { AuthenticationError } from '~/lib/.server/error-types';
import type { ContentItemHit } from '~/routes/search/types';

import {
  ALL_ARTICLES_CATEGORY_FACET,
  ALL_ARTICLES_INDEX_NAME,
  ALL_ARTICLES_TYPE_FILTER,
} from './all-articles-page';
import { parseAllArticlesUrlState } from './all-articles-url-state';

/** Matches largest grid column count in `all-articles.partial.tsx`. */
const ALL_ARTICLES_LOADER_HITS_PER_PAGE = 12;

export type ArticleCategoryFacetItem = {
  value: string;
  label: string;
  count: number;
};

export type AllArticlesReturnType = {
  initialArticleHits: ContentItemHit[];
  articleCategoryFacets: ArticleCategoryFacetItem[];
  articlesNbPages: number;
  articlesPage: number;
};

function refinementListToFacetFilters(
  refinementList: Record<string, string[]> | undefined,
): string[][] | undefined {
  if (!refinementList || Object.keys(refinementList).length === 0) {
    return undefined;
  }
  const groups: string[][] = [];
  for (const [attr, values] of Object.entries(refinementList)) {
    if (!values?.length) {
      continue;
    }
    groups.push(values.map((v) => `${attr}:"${escapeAlgoliaFilterString(v)}"`));
  }
  return groups.length > 0 ? groups : undefined;
}

function mapFacetRecord(
  facets: Record<string, Record<string, number>> | undefined,
  attribute: string,
): ArticleCategoryFacetItem[] {
  const slice = facets?.[attribute];
  if (!slice) return [];
  return Object.entries(slice)
    .map(([value, count]) => ({
      value,
      label: value,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function buildArticlesSearchParams(
  urlState: ReturnType<typeof parseAllArticlesUrlState>,
): {
  filters: string;
  hitsPerPage: number;
  page: number;
  distinct: boolean;
  query?: string;
  facetFilters?: string[][];
} {
  const params: {
    filters: string;
    hitsPerPage: number;
    page: number;
    distinct: boolean;
    query?: string;
    facetFilters?: string[][];
  } = {
    filters: ALL_ARTICLES_TYPE_FILTER,
    hitsPerPage: ALL_ARTICLES_LOADER_HITS_PER_PAGE,
    page: urlState.page ?? 0,
    distinct: true,
  };
  const q = urlState.query?.trim();
  if (q) {
    params.query = q;
  }
  const facetFilters = refinementListToFacetFilters(urlState.refinementList);
  if (facetFilters) {
    params.facetFilters = facetFilters;
  }
  return params;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  let initialArticleHits: ContentItemHit[] = [];
  let articleCategoryFacets: ArticleCategoryFacetItem[] = [];
  let articlesNbPages = 0;

  const url = new URL(request.url);
  const urlState = parseAllArticlesUrlState(url.searchParams);
  const articlesPage = urlState.page ?? 0;
  const client = algoliasearch(appId, searchApiKey, {});

  try {
    const [hitsRes, facetRes] = await Promise.all([
      client.searchSingleIndex({
        indexName: ALL_ARTICLES_INDEX_NAME,
        searchParams: buildArticlesSearchParams(urlState),
      }),
      client.searchSingleIndex({
        indexName: ALL_ARTICLES_INDEX_NAME,
        searchParams: {
          filters: ALL_ARTICLES_TYPE_FILTER,
          distinct: true,
          hitsPerPage: 0,
          facets: [ALL_ARTICLES_CATEGORY_FACET],
          maxValuesPerFacet: 50,
        },
      }),
    ]);

    initialArticleHits = (hitsRes.hits ?? []).map(
      (h) => h as unknown as ContentItemHit,
    );
    articlesNbPages = hitsRes.nbPages ?? 0;
    articleCategoryFacets = mapFacetRecord(
      facetRes.facets as Record<string, Record<string, number>> | undefined,
      ALL_ARTICLES_CATEGORY_FACET,
    );
  } catch (error) {
    console.error('[articles/all-articles] Algolia loader fetch failed', error);
  }

  return Response.json({
    initialArticleHits,
    articleCategoryFacets,
    articlesNbPages,
    articlesPage,
  } satisfies AllArticlesReturnType);
};
