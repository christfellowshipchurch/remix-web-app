import { describe, it, expect } from 'vitest';
import { buildCacheKey, TTL } from '../cache-utils';

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
