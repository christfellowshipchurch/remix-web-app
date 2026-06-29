import { describe, it, expect, vi } from 'vitest';
import {
  buildCacheKey,
  extractContentItemIds,
  invalidateItem,
  itemTagKey,
  TTL,
} from '../cache-utils';
import type Redis from 'ioredis';

describe('TTL constants', () => {
  it('has expected values', () => {
    expect(TTL.NONE).toBe(0);
    expect(TTL.SHORT).toBe(300);
    expect(TTL.DEFAULT).toBe(3600);
    expect(TTL.LONG).toBe(86400);
  });
});

describe('buildCacheKey', () => {
  it('returns a key in rock:{endpoint}:{hash12} format', () => {
    const key = buildCacheKey('People', { $top: '10' });
    expect(key).toMatch(/^rock:People:[a-f0-9]{12}$/);
  });

  it('produces the same key regardless of param ordering', () => {
    const key1 = buildCacheKey('ContentChannelItems', {
      $filter: 'ContentChannelId eq 43',
      $top: '10',
    });
    const key2 = buildCacheKey('ContentChannelItems', {
      $top: '10',
      $filter: 'ContentChannelId eq 43',
    });
    expect(key1).toBe(key2);
  });

  it('produces different keys for different params', () => {
    const key1 = buildCacheKey('People', { $top: '10' });
    const key2 = buildCacheKey('People', { $top: '20' });
    expect(key1).not.toBe(key2);
  });

  it('produces different keys for different endpoints', () => {
    const key1 = buildCacheKey('People', { $top: '10' });
    const key2 = buildCacheKey('Groups', { $top: '10' });
    expect(key1).not.toBe(key2);
  });

  it('excludes undefined values from the hash', () => {
    const key1 = buildCacheKey('People', { $top: '10', $filter: undefined });
    const key2 = buildCacheKey('People', { $top: '10' });
    expect(key1).toBe(key2);
  });

  it('normalizes leading and trailing slashes on the endpoint', () => {
    const key1 = buildCacheKey('People', { $top: '10' });
    const key2 = buildCacheKey('/People/', { $top: '10' });
    const key3 = buildCacheKey('//People', { $top: '10' });
    expect(key1).toBe(key2);
    expect(key1).toBe(key3);
  });

  it('produces a stable key for empty params', () => {
    const key1 = buildCacheKey('People', {});
    const key2 = buildCacheKey('People', {});
    expect(key1).toBe(key2);
    expect(key1).toMatch(/^rock:People:[a-f0-9]{12}$/);
  });
});

describe('itemTagKey', () => {
  it('namespaces the id under cfitem:', () => {
    expect(itemTagKey(12345)).toBe('cfitem:12345');
    expect(itemTagKey('42')).toBe('cfitem:42');
  });
});

describe('extractContentItemIds', () => {
  // A content item is identified by having BOTH id and contentChannelId. This is
  // what lets us tag only content-channel entries and ignore everything else.
  it('returns the id of a single content item object', () => {
    expect(extractContentItemIds({ id: 7, contentChannelId: 43 })).toEqual([
      '7',
    ]);
  });

  it('returns ids for every item in a list', () => {
    const list = [
      { id: 1, contentChannelId: 43 },
      { id: 2, contentChannelId: 43 },
    ];
    expect(extractContentItemIds(list)).toEqual(['1', '2']);
  });

  it('ignores objects without a contentChannelId (e.g. People, Campuses)', () => {
    // A Person carries an id but no contentChannelId — tagging it would let an
    // unrelated entity collide with a content item in the reverse index.
    expect(extractContentItemIds({ id: 99, email: 'a@b.com' })).toEqual([]);
  });

  it('does not tag nested entities, only the top-level item', () => {
    // The author is a nested object with its own id; only the top-level content
    // item (which has contentChannelId) should be indexed.
    const item = { id: 5, contentChannelId: 43, author: { id: 900 } };
    expect(extractContentItemIds(item)).toEqual(['5']);
  });

  it('coerces numeric and string ids to strings', () => {
    expect(extractContentItemIds({ id: 5, contentChannelId: 43 })).toEqual([
      '5',
    ]);
    expect(extractContentItemIds({ id: '5', contentChannelId: 43 })).toEqual([
      '5',
    ]);
  });

  it('skips items with a null id', () => {
    expect(extractContentItemIds({ id: null, contentChannelId: 43 })).toEqual(
      [],
    );
  });

  it('returns [] for empty arrays, scalars and null', () => {
    expect(extractContentItemIds([])).toEqual([]);
    expect(extractContentItemIds(42)).toEqual([]);
    expect(extractContentItemIds(null)).toEqual([]);
  });
});

describe('invalidateItem', () => {
  it('returns 0 and does nothing when redis is null', async () => {
    expect(await invalidateItem(null, 12345)).toBe(0);
  });

  it('deletes every cache key that contained the item, then the index entry', async () => {
    // Intent: when an editor updates item 12345, every list/aggregate cache
    // entry that included it must be removed — not just its single-item entry.
    const containingKeys = [
      'rock:ContentChannelItems:aaaaaaaaaaaa', // a list page
      'rock:ContentChannelItems/GetByAttributeValue:bbbbbbbbbbbb', // its own page
    ];
    const del = vi.fn();
    const pipeline = { del, exec: vi.fn().mockResolvedValue([]) };
    const redis = {
      smembers: vi.fn().mockResolvedValue(containingKeys),
      pipeline: vi.fn().mockReturnValue(pipeline),
    } as unknown as Redis;

    const deleted = await invalidateItem(redis, 12345);

    expect(redis.smembers).toHaveBeenCalledWith('cfitem:12345');
    expect(del).toHaveBeenNthCalledWith(1, ...containingKeys);
    expect(del).toHaveBeenNthCalledWith(2, 'cfitem:12345');
    expect(deleted).toBe(2);
  });

  it('deletes only the index entry and returns 0 when the item has no cached keys', async () => {
    const del = vi.fn();
    const pipeline = { del, exec: vi.fn().mockResolvedValue([]) };
    const redis = {
      smembers: vi.fn().mockResolvedValue([]),
      pipeline: vi.fn().mockReturnValue(pipeline),
    } as unknown as Redis;

    const deleted = await invalidateItem(redis, 12345);

    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith('cfitem:12345');
    expect(deleted).toBe(0);
  });
});
