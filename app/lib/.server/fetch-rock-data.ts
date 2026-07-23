import { normalize } from '~/lib/utils';
import redis from './redis-config';
import {
  buildCacheKey,
  extractContentItemIds,
  itemTagKey,
  TTL,
  type TTLValue,
} from './cache-utils';

export { TTL, deleteByPrefix, invalidateItem } from './cache-utils';
export type { TTLValue } from './cache-utils';
interface RockDataRequest {
  endpoint: string;
  body: Record<string, unknown> | string;
  contentType?: string;
}

const baseUrl = `${process.env.ROCK_API}`;
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization-Token': `${process.env.ROCK_TOKEN}`,
};

/**
 * When true, this deployment shows Pending/unapproved content and skips the
 * shared Redis cache — used by the preview domain (CFDP-4143). Never set on prod.
 */
export const isPreviewMode = (): boolean =>
  process.env.SHOW_UNAPPROVED_CONTENT === 'true';

/**
 *
 * @param endpoint - the Rock endpoint to fetch data from
 * @param queryParams - query parameters to append to the request
 * @param customHeaders - additional headers to include in the request eg. Rock Cookie
 * @param cache - if true, the data will be cached. Default is true.
 * @returns Either the response data as JSON(array if multiple items, object if single item) or an error
 */

/**
 * Interface for Rock API query parameters
 */
interface RockQueryParams {
  /** Expands related entities inline */
  $expand?: string;

  /** Filters results based on Boolean condition (e.g. ContentChannelId eq 63) */
  $filter?: string;

  /** Selects which properties to include in response */
  $select?: string;

  /** Sorts results (e.g. StartDateTime desc) */
  $orderby?: string;

  /** Returns only first n results */
  $top?: string;

  /** Skips first n results */
  $skip?: string;

  /** Specify 'simple' or 'expanded' to load attributes */
  loadAttributes?: 'simple' | 'expanded';

  /** Comma-delimited list of attribute keys to limit specific attributes */
  attributeKey?: string;

  /** Value to filter by */
  value?: string;
}

/** Options for fetchRockData beyond query params */
interface FetchRockDataOptions {
  endpoint: string;
  queryParams?: RockQueryParams;
  customHeaders?: Record<string, string>;
  /** @deprecated Use `ttl` instead. Pass `ttl: TTL.NONE` to skip caching. */
  cache?: boolean;
  /** TTL in seconds. Use TTL.NONE to skip, TTL.SHORT/DEFAULT/LONG for presets. Defaults to TTL.DEFAULT (3600). */
  ttl?: TTLValue;
  /** When true, merge $filter so only items where now is within [StartDateTime, ExpireDateTime] are returned */
  filterByDateRange?: boolean;
  /** When true, merge $filter with Status eq 'Approved' */
  filterByStatusApproved?: boolean;
}

/**
 * Item with optional start/expire dates (camelCase or PascalCase from Rock API).
 * Use with isItemInDateRange to filter in-memory lists (e.g. by-ID fetches).
 */
export type ItemWithDateRange = {
  startDateTime?: string;
  expireDateTime?: string;
  StartDateTime?: string;
  ExpireDateTime?: string;
};

export const isItemInDateRange = (
  item: ItemWithDateRange,
  now: Date,
): boolean => {
  const start = item.startDateTime ?? item.StartDateTime;
  const expire = item.expireDateTime ?? item.ExpireDateTime;
  if (start) {
    const startDate = new Date(start);
    if (now < startDate) return false;
  }
  if (expire) {
    const expireDate = new Date(expire);
    if (now > expireDate) return false;
  }
  return true;
};

const buildMergedFilter = (
  existingFilter: string | undefined,
  filterByDateRange: boolean,
  filterByStatusApproved: boolean,
): string | undefined => {
  const clauses: string[] = [];

  if (filterByDateRange) {
    const isoNow = new Date().toISOString();
    clauses.push(
      `StartDateTime le datetime'${isoNow}' and (ExpireDateTime eq null or ExpireDateTime ge datetime'${isoNow}')`,
    );
  }
  if (filterByStatusApproved) {
    clauses.push("Status eq 'Approved'");
  }
  if (clauses.length === 0) {
    return existingFilter;
  }
  const newClause = clauses.join(' and ');
  return existingFilter ? `(${existingFilter}) and (${newClause})` : newClause;
};

const isSingleItemAttributeValueFetch = (endpoint: string): boolean =>
  endpoint.replace(/^\/+|\/+$/g, '') ===
  'ContentChannelItems/GetByAttributeValue';

/**
 * Removes a literal Status eq 'Approved' clause from a caller-built $filter
 * string. Several loaders embed this clause directly rather than going
 * through `filterByStatusApproved`, so preview mode strips it here instead
 * of touching every call site.
 */
const stripApprovedStatusFilter = (
  filter: string | undefined,
): string | undefined => {
  if (!filter) return filter;
  const stripped = filter
    .replace(/\s+and\s+Status eq 'Approved'/gi, '')
    .replace(/Status eq 'Approved'\s+and\s+/gi, '')
    .replace(/Status eq 'Approved'/gi, '')
    .trim();
  return stripped || undefined;
};

const applyDateRangeFilter = <T>(data: T, now: Date): T | [] => {
  if (Array.isArray(data)) {
    const filteredData = data.filter((item) =>
      isItemInDateRange(item as ItemWithDateRange, now),
    );

    return filteredData.length === 1 ? filteredData[0] : (filteredData as T);
  }

  if (
    data &&
    typeof data === 'object' &&
    !isItemInDateRange(data as ItemWithDateRange, now)
  ) {
    return [];
  }

  return data;
};

export const fetchRockData = async ({
  endpoint,
  queryParams = {},
  customHeaders = {},
  cache = true,
  ttl,
  filterByDateRange = false,
  filterByStatusApproved = false,
}: FetchRockDataOptions) => {
  const previewMode = isPreviewMode();
  // Preview mode shows Pending/unapproved content, so neither filter applies:
  // Status is meant to be bypassed, and date-range would otherwise hide
  // not-yet-scheduled or already-expired items a manager still wants to check.
  const effectiveFilterByDateRange = filterByDateRange && !previewMode;
  const effectiveFilterByStatusApproved = filterByStatusApproved && !previewMode;

  const mergedQueryParams = { ...queryParams };
  const shouldFilterDateRangeInMemory =
    effectiveFilterByDateRange && isSingleItemAttributeValueFetch(endpoint);

  if (effectiveFilterByDateRange || effectiveFilterByStatusApproved) {
    mergedQueryParams.$filter = buildMergedFilter(
      queryParams.$filter,
      shouldFilterDateRangeInMemory ? false : effectiveFilterByDateRange,
      effectiveFilterByStatusApproved,
    );
  }

  // Some loaders embed Status eq 'Approved' directly in their $filter string
  // instead of using filterByStatusApproved — strip it here too.
  if (previewMode) {
    mergedQueryParams.$filter = stripApprovedStatusFilter(
      mergedQueryParams.$filter,
    );
  }

  const cacheKey = buildCacheKey(
    endpoint,
    mergedQueryParams as Record<string, string>,
  );
  // Preview never reads or writes the shared Redis cache — this deployment's
  // results (unapproved content, no date-range filtering) must never be
  // served to or poison prod's cache.
  const effectiveTtl: number = previewMode
    ? TTL.NONE
    : ttl !== undefined
      ? ttl
      : cache === false
        ? TTL.NONE
        : TTL.DEFAULT;

  // Try to use Redis cache if available and TTL > 0
  if (redis && effectiveTtl > 0) {
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        return shouldFilterDateRangeInMemory
          ? applyDateRangeFilter(parsedData, new Date())
          : parsedData;
      }
    } catch {
      console.error(
        '⚠️ Redis cache retrieval failed, falling back to API call',
      );
    }
  }

  try {
    const queryString = new URLSearchParams(
      mergedQueryParams as Record<string, string>,
    ).toString();
    const url = `${baseUrl}${endpoint}?${queryString}`;

    const res = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...customHeaders,
      },
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      throw new Error(
        `⚠️ Error Fetching Rock Data status: ${res.status}, details: ${errorDetails}, path: ${url}`,
      );
    }

    const data = await res
      .json()
      .then((data) => normalize(data))
      .then((data: unknown) =>
        Array.isArray(data) && data?.length === 1 ? data[0] : data,
      );

    // Cache the response if Redis is available and TTL > 0
    if (redis && effectiveTtl > 0) {
      try {
        const itemIds = extractContentItemIds(data);
        if (itemIds.length === 0) {
          await redis.set(cacheKey, JSON.stringify(data), 'EX', effectiveTtl);
        } else {
          // Cache the entry and record it in each item's reverse index in one
          // round-trip. The index lets us later invalidate a single item by
          // deleting exactly the keys that contain it. EXPIRE caps the index so
          // it can't grow unbounded after the entries it references age out.
          const pipeline = redis.pipeline();
          pipeline.set(cacheKey, JSON.stringify(data), 'EX', effectiveTtl);
          for (const id of itemIds) {
            const tag = itemTagKey(id);
            pipeline.sadd(tag, cacheKey);
            pipeline.expire(tag, TTL.LONG);
          }
          await pipeline.exec();
        }
      } catch {
        console.error('⚠️ Redis cache storage failed');
      }
    }

    return shouldFilterDateRangeInMemory
      ? applyDateRangeFilter(data, new Date())
      : data;
  } catch (error) {
    console.error('Error fetching rock data:', error);
    throw error;
  }
};

/**
 *
 * @param endpoint - a string representing the Rock endpoint to delete
 * @returns the status code of the response
 */
export const deleteRockData = async (endpoint: string) => {
  try {
    const response = await fetch(`${process.env.ROCK_API}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization-Token': `${process.env.ROCK_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      throw new Error(
        `Failed to delete resource: ${response.status}, details: ${errorDetails}`,
      );
    }

    return response.status;
  } catch (error) {
    console.error('Error in deleteRockData:', error);
    throw error;
  }
};

/**
 * Posts data to a Rock endpoint
 * @param params.endpoint - Rock endpoint to post to
 * @param params.body - the body of the post request
 * @returns response body parsed as JSON when present
 */
export const postRockData = async ({
  endpoint,
  body,
  contentType = 'application/json',
}: RockDataRequest) => {
  const response = await fetch(`${process.env.ROCK_API}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'Authorization-Token': `${process.env.ROCK_TOKEN}`,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Failed to post data: ${response.status}, details: ${errorDetails}`,
    );
  }

  const responseBody = await response.text();
  if (!responseBody) {
    return {};
  }

  return JSON.parse(responseBody);
};

/**
 * Updates data at a Rock endpoint using PUT
 * @param params.endpoint - Rock endpoint to put to
 * @param params.body - the body of the put request
 * @returns response body as JSON
 */
export const putRockData = async ({ endpoint, body }: RockDataRequest) => {
  const response = await fetch(`${process.env.ROCK_API}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization-Token': `${process.env.ROCK_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Failed to put data: ${response.status}, details: ${errorDetails}`,
    );
  }

  const responseBody = await response.text();
  return responseBody ? JSON.parse(responseBody) : {};
};

/**
 * Updates data at a Rock endpoint using PATCH
 * @param params.endpoint - Rock endpoint to patch
 * @param params.body - the body of the patch request
 * @returns response status code
 */
export const patchRockData = async ({ endpoint, body }: RockDataRequest) => {
  const response = await fetch(`${process.env.ROCK_API}/${endpoint}`, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Failed to patch data: ${response.status}, details: ${errorDetails}`,
    );
  }

  return response.status;
};

/**
 * Deletes a specific cache key from Redis
 * @param endpoint - The Rock endpoint that was cached
 * @param queryParams - The query parameters that were used in the original request
 * @returns boolean indicating whether the deletion was successful
 */
export const deleteCacheKey = async ({
  endpoint,
  queryParams = {},
}: {
  endpoint: string;
  queryParams?: RockQueryParams;
}): Promise<boolean> => {
  if (!redis) {
    console.error('⚠️ Redis not available for cache deletion');
    return false;
  }

  try {
    const cacheKey = buildCacheKey(
      endpoint,
      queryParams as Record<string, string>,
    );
    await redis.del(cacheKey);
    return true;
  } catch (error) {
    console.error('Error deleting cache key:', error);
    return false;
  }
};
