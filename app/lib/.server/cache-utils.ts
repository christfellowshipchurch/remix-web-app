import { createHash } from 'crypto';
import type Redis from 'ioredis';

/** TTL presets in seconds */
export const TTL = {
  /** Skip caching entirely */
  NONE: 0,
  /** 5 minutes — time-sensitive data */
  SHORT: 300,
  /** 1 hour — standard content */
  DEFAULT: 3600,
  /** 24 hours — rarely changing reference data */
  LONG: 86400,
} as const;

export type TTLValue = (typeof TTL)[keyof typeof TTL] | number;

/**
 * Matches the volatile date-range clause that `buildMergedFilter` injects into
 * Rock `$filter` values (`StartDateTime le datetime'<iso>' and ...`).
 *
 * Those timestamps change on every request, so hashing them verbatim produces a
 * unique cache key each time (effectively disabling cache and orphaning keys).
 */
const VOLATILE_DATE_RANGE_FILTER_PATTERN =
  /StartDateTime le datetime'[^']+' and \(ExpireDateTime eq null or ExpireDateTime ge datetime'[^']+'\)/g;

/** Stable placeholder substituted before hashing so date-range queries share a key. */
const STABLE_DATE_RANGE_FILTER =
  "StartDateTime le datetime'{now}' and (ExpireDateTime eq null or ExpireDateTime ge datetime'{now}')";

/**
 * Replaces live date-range timestamps in a `$filter` with a stable placeholder.
 * The live filter is still sent to Rock; only the cache-key hash input is stabilized.
 */
export function stabilizeFilterForCacheKey(
  filter: string | undefined,
): string | undefined {
  if (filter === undefined) return undefined;
  return filter.replace(
    VOLATILE_DATE_RANGE_FILTER_PATTERN,
    STABLE_DATE_RANGE_FILTER,
  );
}

/**
 * Builds a deterministic, namespaced Redis cache key.
 *
 * Format: `rock:{endpoint}:{hash12}`
 * - Endpoint is normalized (no leading/trailing slashes)
 * - Query params are sorted alphabetically and hashed (SHA-256, first 12 hex chars)
 * - Identical params in any order produce the same key
 * - Volatile `filterByDateRange` timestamps in `$filter` are normalized so
 *   repeat requests for the same logical query reuse one key (CFDP-4087)
 */
export function buildCacheKey(
  endpoint: string,
  queryParams: Record<string, string | undefined>,
): string {
  const normalizedEndpoint = endpoint.replace(/^\/+|\/+$/g, '');

  const sortedEntries = Object.entries(queryParams)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([key, value]): [string, string] => [
      key,
      key === '$filter' ? (stabilizeFilterForCacheKey(value) ?? value) : value,
    ])
    .sort(([a], [b]) => a.localeCompare(b));

  const paramString = JSON.stringify(sortedEntries);
  const hash = createHash('sha256')
    .update(paramString)
    .digest('hex')
    .slice(0, 12);

  return `rock:${normalizedEndpoint}:${hash}`;
}

/**
 * Deletes all cache keys matching a given endpoint prefix.
 * Useful for invalidating all cached data for a specific Rock endpoint.
 *
 * Uses SCAN instead of KEYS to walk the keyspace in small increments —
 * KEYS blocks the single-threaded Redis server for the full scan duration,
 * which is risky once the keyspace grows.
 *
 * @returns Number of keys deleted
 */
export async function deleteByPrefix(
  redis: Redis | null,
  endpointPrefix: string,
): Promise<number> {
  if (!redis) return 0;

  const normalizedPrefix = endpointPrefix.replace(/^\/+|\/+$/g, '');
  const pattern = `rock:${normalizedPrefix}:*`;

  const keys: string[] = [];
  let cursor = '0';

  do {
    const [nextCursor, batch] = await redis.scan(
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      100,
    );
    keys.push(...batch);
    cursor = nextCursor;
  } while (cursor !== '0');

  if (keys.length === 0) return 0;
  return redis.del(...keys);
}
