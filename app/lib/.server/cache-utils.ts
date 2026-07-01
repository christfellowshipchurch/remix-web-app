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
 * Builds a deterministic, namespaced Redis cache key.
 *
 * Format: `rock:{endpoint}:{hash12}`
 * - Endpoint is normalized (no leading/trailing slashes)
 * - Query params are sorted alphabetically and hashed (SHA-256, first 12 hex chars)
 * - Identical params in any order produce the same key
 */
export function buildCacheKey(
  endpoint: string,
  queryParams: Record<string, string | undefined>,
): string {
  const normalizedEndpoint = endpoint.replace(/^\/+|\/+$/g, '');

  const sortedEntries = Object.entries(queryParams)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));

  const paramString = JSON.stringify(sortedEntries);
  const hash = createHash('sha256')
    .update(paramString)
    .digest('hex')
    .slice(0, 12);

  return `rock:${normalizedEndpoint}:${hash}`;
}

/**
 * Redis key namespace for the per-item reverse index (a Set of cache keys that
 * contain the given content item). Kept separate from the `rock:` cache namespace
 * so a future full flush of `rock:*` won't clear the index, and vice versa.
 */
export const itemTagKey = (id: string | number): string => `cfitem:${id}`;

/**
 * Extracts top-level Rock ContentChannelItem ids from a normalized fetchRockData
 * response (which is either a single item object or an array of items).
 *
 * An item is only counted when it carries BOTH `id` and `contentChannelId`, which
 * is unique to content-channel items. This skips non-content endpoints (People,
 * Campuses, DefinedValues) and nested entities (authors, defined values) so we
 * only tag cache entries by the content items they actually contain.
 */
export function extractContentItemIds(data: unknown): string[] {
  const items = Array.isArray(data) ? data : [data];
  const ids: string[] = [];
  for (const item of items) {
    if (
      item &&
      typeof item === 'object' &&
      'contentChannelId' in item &&
      'id' in item &&
      (item as { id: unknown }).id != null
    ) {
      ids.push(String((item as { id: unknown }).id));
    }
  }
  return ids;
}

/**
 * Invalidates every cache entry that contains content item `id`: its own
 * single-item entry plus every list/aggregate entry that included it. Uses the
 * reverse index (`cfitem:{id}`) for exact key lookup — no KEYS/SCAN — then clears
 * the index entry itself.
 *
 * @returns Number of cache keys deleted (0 when redis is unavailable / no index)
 */
export async function invalidateItem(
  redis: Redis | null,
  id: string | number,
): Promise<number> {
  if (!redis) return 0;

  const tag = itemTagKey(id);
  const keys = await redis.smembers(tag);

  const pipeline = redis.pipeline();
  if (keys.length > 0) pipeline.del(...keys);
  pipeline.del(tag); // drop the index entry (also prunes now-dead references)
  await pipeline.exec();

  return keys.length;
}

/**
 * Deletes all cache keys matching a given endpoint prefix.
 * Useful for invalidating all cached data for a specific Rock endpoint.
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
  const keys = await redis.keys(pattern);

  if (keys.length === 0) return 0;
  return redis.del(...keys);
}
