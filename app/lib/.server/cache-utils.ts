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
