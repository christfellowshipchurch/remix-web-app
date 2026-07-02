import { describe, it, expect, vi } from 'vitest';
import type Redis from 'ioredis';
import { buildCacheKey, deleteByPrefix, TTL } from '../cache-utils';

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

describe('deleteByPrefix', () => {
  it('returns 0 without touching redis when redis is null', async () => {
    const result = await deleteByPrefix(null, 'People');
    expect(result).toBe(0);
  });

  it('never calls KEYS — uses SCAN to find matching keys', async () => {
    const keysSpy = vi.fn();
    const scan = vi
      .fn()
      .mockResolvedValue(['0', ['rock:People:aaa', 'rock:People:bbb']]);
    const del = vi.fn().mockResolvedValue(2);
    const fakeRedis = { keys: keysSpy, scan, del } as unknown as Redis;

    const result = await deleteByPrefix(fakeRedis, 'People');

    expect(keysSpy).not.toHaveBeenCalled();
    expect(scan).toHaveBeenCalledWith(
      '0',
      'MATCH',
      'rock:People:*',
      'COUNT',
      100,
    );
    expect(del).toHaveBeenCalledWith('rock:People:aaa', 'rock:People:bbb');
    expect(result).toBe(2);
  });

  it('follows a multi-page scan cursor and deletes all pages in one batch', async () => {
    const scan = vi
      .fn()
      .mockResolvedValueOnce(['42', ['rock:Groups:aaa']])
      .mockResolvedValueOnce(['0', ['rock:Groups:bbb']]);
    const del = vi.fn().mockResolvedValue(2);
    const fakeRedis = { scan, del } as unknown as Redis;

    const result = await deleteByPrefix(fakeRedis, 'Groups');

    expect(scan).toHaveBeenCalledTimes(2);
    expect(scan).toHaveBeenNthCalledWith(
      2,
      '42',
      'MATCH',
      'rock:Groups:*',
      'COUNT',
      100,
    );
    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith('rock:Groups:aaa', 'rock:Groups:bbb');
    expect(result).toBe(2);
  });

  it('returns 0 and does not call del when no keys match', async () => {
    const scan = vi.fn().mockResolvedValue(['0', []]);
    const del = vi.fn();
    const fakeRedis = { scan, del } as unknown as Redis;

    const result = await deleteByPrefix(fakeRedis, 'Nonexistent');

    expect(del).not.toHaveBeenCalled();
    expect(result).toBe(0);
  });

  it('normalizes leading and trailing slashes when building the MATCH pattern', async () => {
    const scan = vi.fn().mockResolvedValue(['0', []]);
    const fakeRedis = { scan, del: vi.fn() } as unknown as Redis;

    await deleteByPrefix(fakeRedis, '/People/');

    expect(scan).toHaveBeenCalledWith(
      '0',
      'MATCH',
      'rock:People:*',
      'COUNT',
      100,
    );
  });
});
