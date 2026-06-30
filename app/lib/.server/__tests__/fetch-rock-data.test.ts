import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchRockData,
  deleteRockData,
  postRockData,
  patchRockData,
  deleteCacheKey,
  isItemInDateRange,
  TTL,
} from '../fetch-rock-data';
import { buildCacheKey } from '../cache-utils';

// Mock redis to null so all tests bypass cache
vi.mock('../redis-config', () => ({ default: null }));

vi.mock('~/lib/utils', () => ({
  normalize: (data: unknown) => data,
}));

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ROCK_API = 'https://rock.example.com/api/';
  process.env.ROCK_TOKEN = 'test-token';
  global.fetch = vi.fn();
});

// ─── isItemInDateRange ──────────────────────────────────────────────────────

describe('isItemInDateRange', () => {
  const now = new Date('2025-06-15T12:00:00Z');

  it('returns true when no start or expire dates set', () => {
    expect(isItemInDateRange({}, now)).toBe(true);
  });

  it('returns false when now is before startDateTime', () => {
    expect(
      isItemInDateRange({ startDateTime: '2025-07-01T00:00:00Z' }, now),
    ).toBe(false);
  });

  it('returns true when now is after startDateTime', () => {
    expect(
      isItemInDateRange({ startDateTime: '2025-01-01T00:00:00Z' }, now),
    ).toBe(true);
  });

  it('returns false when now is after expireDateTime', () => {
    expect(
      isItemInDateRange({ expireDateTime: '2025-01-01T00:00:00Z' }, now),
    ).toBe(false);
  });

  it('returns true when now is before expireDateTime', () => {
    expect(
      isItemInDateRange({ expireDateTime: '2025-12-31T00:00:00Z' }, now),
    ).toBe(true);
  });

  it('supports PascalCase StartDateTime and ExpireDateTime', () => {
    expect(
      isItemInDateRange(
        {
          StartDateTime: '2025-01-01T00:00:00Z',
          ExpireDateTime: '2025-12-31T00:00:00Z',
        },
        now,
      ),
    ).toBe(true);
  });

  it('returns false when now is outside the date range', () => {
    expect(
      isItemInDateRange(
        {
          startDateTime: '2025-01-01T00:00:00Z',
          expireDateTime: '2025-05-01T00:00:00Z',
        },
        now,
      ),
    ).toBe(false);
  });
});

// ─── fetchRockData ──────────────────────────────────────────────────────────

describe('fetchRockData', () => {
  it('fetches from the correct URL with query params', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }, { id: 2 }],
    });

    await fetchRockData({
      endpoint: 'ContentChannelItems',
      queryParams: { $top: '10' },
    });

    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(calledUrl).toContain('ContentChannelItems');
    expect(calledUrl).toContain('%24top=10');
  });

  it('returns a single object when array has length 1', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 42 }],
    });

    const result = await fetchRockData({ endpoint: 'People' });
    expect(result).toEqual({ id: 42 });
  });

  it('returns the full array when length > 1', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => items,
    });

    const result = await fetchRockData({ endpoint: 'People' });
    expect(result).toEqual(items);
  });

  it('throws when response is not ok', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });

      await expect(fetchRockData({ endpoint: 'People' })).rejects.toThrow(
        '⚠️ Error Fetching Rock Data',
      );
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('includes Content-Type application/json header', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchRockData({ endpoint: 'People' });

    const headers = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]
      .headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('merges custom headers', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchRockData({
      endpoint: 'People',
      customHeaders: { Cookie: 'rock-session=abc' },
    });

    const headers = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]
      .headers as Record<string, string>;
    expect(headers['Cookie']).toBe('rock-session=abc');
  });
});

// ─── deleteRockData ─────────────────────────────────────────────────────────

describe('deleteRockData', () => {
  it('returns response status on success', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const status = await deleteRockData('People/1');
    expect(status).toBe(204);
  });

  it('throws when response is not ok', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });

      await expect(deleteRockData('People/99')).rejects.toThrow(
        'Failed to delete resource',
      );
    } finally {
      errorSpy.mockRestore();
    }
  });
});

// ─── postRockData ───────────────────────────────────────────────────────────

describe('postRockData', () => {
  it('returns parsed JSON body on success', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ id: 10 }),
    });

    const result = await postRockData({
      endpoint: 'People',
      body: { name: 'Test' },
    });
    expect(result).toEqual({ id: 10 });
  });

  it('returns empty object when response body is empty', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      text: async () => '',
    });

    const result = await postRockData({ endpoint: 'People', body: {} });
    expect(result).toEqual({});
  });

  it('throws when response is not ok', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    });

    await expect(
      postRockData({ endpoint: 'People', body: {} }),
    ).rejects.toThrow('Failed to post data');
  });
});

// ─── patchRockData ──────────────────────────────────────────────────────────

describe('patchRockData', () => {
  it('returns response status on success', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const status = await patchRockData({
      endpoint: 'People/1',
      body: { firstName: 'John' },
    });
    expect(status).toBe(200);
  });

  it('throws when response is not ok', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Server Error',
    });

    await expect(
      patchRockData({ endpoint: 'People/1', body: {} }),
    ).rejects.toThrow('Failed to patch data');
  });
});

// ─── deleteCacheKey ─────────────────────────────────────────────────────────

describe('deleteCacheKey', () => {
  it('returns false when redis is null (no redis configured)', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const result = await deleteCacheKey({
        endpoint: 'People',
        queryParams: { $top: '10' },
      });
      expect(result).toBe(false);
    } finally {
      errorSpy.mockRestore();
    }
  });
});

// ─── TTL / caching behavior (with mocked Redis) ─────────────────────────────

describe('fetchRockData TTL behavior', () => {
  const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  };

  beforeEach(async () => {
    vi.useRealTimers();
    vi.resetModules();
    vi.clearAllMocks();
    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue('OK');
    mockRedis.del.mockResolvedValue(1);

    // Re-mock redis with our fake instance
    vi.doMock('../redis-config', () => ({ default: mockRedis }));
  });

  it('caches with TTL.DEFAULT (3600) when no ttl is specified', async () => {
    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    await fetchWithRedis({ endpoint: 'People' });

    expect(mockRedis.set).toHaveBeenCalledWith(
      expect.stringMatching(/^rock:People:/),
      expect.any(String),
      'EX',
      TTL.DEFAULT,
    );
  });

  it('caches with custom TTL when ttl is specified', async () => {
    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    await fetchWithRedis({ endpoint: 'People', ttl: TTL.LONG });

    expect(mockRedis.set).toHaveBeenCalledWith(
      expect.stringMatching(/^rock:People:/),
      expect.any(String),
      'EX',
      TTL.LONG,
    );
  });

  it('skips cache read and write when ttl is TTL.NONE', async () => {
    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    await fetchWithRedis({ endpoint: 'People', ttl: TTL.NONE });

    expect(mockRedis.get).not.toHaveBeenCalled();
    expect(mockRedis.set).not.toHaveBeenCalled();
  });

  it('skips cache read and write when ttl is TTL.NONE', async () => {
    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    await fetchWithRedis({ endpoint: 'People', ttl: TTL.NONE });

    expect(mockRedis.get).not.toHaveBeenCalled();
    expect(mockRedis.set).not.toHaveBeenCalled();
  });

  it('returns cached data without calling fetch when cache hit', async () => {
    const cachedItem = { id: 99, name: 'Cached' };
    mockRedis.get.mockResolvedValueOnce(JSON.stringify(cachedItem));

    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');
    const result = await fetchWithRedis({ endpoint: 'People' });

    expect(result).toEqual(cachedItem);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uses buildCacheKey format for cache key', async () => {
    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    const queryParams = { $top: '10', $filter: 'ContentChannelId eq 43' };
    await fetchWithRedis({ endpoint: 'ContentChannelItems', queryParams });

    const expectedKey = buildCacheKey('ContentChannelItems', queryParams);
    expect(mockRedis.get).toHaveBeenCalledWith(expectedKey);
    expect(mockRedis.set).toHaveBeenCalledWith(
      expectedKey,
      expect.any(String),
      'EX',
      expect.any(Number),
    );
  });

  it('uses one stable cache key for repeated single-item date-range queries', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-29T12:00:00.000Z'));

    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');
    const rockItem = {
      id: 123,
      title: 'Cached article',
      startDateTime: '2026-06-01T00:00:00.000Z',
      expireDateTime: '2026-07-01T00:00:00.000Z',
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [rockItem],
    });

    const options = {
      endpoint: 'ContentChannelItems/GetByAttributeValue',
      queryParams: {
        attributeKey: 'Pathname',
        $filter: "ContentChannelId eq 43 and Status eq 'Approved'",
        value: 'example',
        loadAttributes: 'simple' as const,
      },
      filterByDateRange: true,
    };

    await expect(fetchWithRedis(options)).resolves.toEqual(rockItem);

    const firstCacheKey = mockRedis.set.mock.calls[0][0];
    mockRedis.get.mockResolvedValueOnce(JSON.stringify(rockItem));
    vi.setSystemTime(new Date('2026-06-29T12:00:01.250Z'));

    await expect(fetchWithRedis(options)).resolves.toEqual(rockItem);

    expect(mockRedis.get).toHaveBeenNthCalledWith(2, firstCacheKey);
    expect(mockRedis.set).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not send the volatile date range clause for single-item date-range queries', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-29T12:00:00.000Z'));

    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 123,
          startDateTime: '2026-06-01T00:00:00.000Z',
          expireDateTime: null,
        },
      ],
    });

    await fetchWithRedis({
      endpoint: 'ContentChannelItems/GetByAttributeValue',
      queryParams: {
        attributeKey: 'Pathname',
        $filter: "ContentChannelId eq 43 and Status eq 'Approved'",
        value: 'example',
        loadAttributes: 'simple',
      },
      filterByDateRange: true,
    });

    const requestUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const requestFilter = new URL(requestUrl).searchParams.get('$filter');
    expect(requestFilter).toContain(
      "ContentChannelId eq 43 and Status eq 'Approved'",
    );
    expect(requestFilter).not.toContain(
      "StartDateTime le datetime'2026-06-29T12:00:00.000Z'",
    );
    expect(requestFilter).not.toContain(
      "ExpireDateTime ge datetime'2026-06-29T12:00:00.000Z'",
    );
  });

  it('filters out-of-range single-item results in memory', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-29T12:00:00.000Z'));

    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 123,
          startDateTime: '2026-07-01T00:00:00.000Z',
          expireDateTime: null,
        },
      ],
    });

    await expect(
      fetchWithRedis({
        endpoint: 'ContentChannelItems/GetByAttributeValue',
        queryParams: {
          attributeKey: 'Pathname',
          value: 'future-example',
          loadAttributes: 'simple',
        },
        filterByDateRange: true,
      }),
    ).resolves.toEqual([]);
  });

  it('unwraps a filtered single item when duplicate matches include out-of-range data', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-29T12:00:00.000Z'));

    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');
    const inRangeItem = {
      id: 123,
      startDateTime: '2026-06-01T00:00:00.000Z',
      expireDateTime: null,
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        inRangeItem,
        {
          id: 456,
          startDateTime: '2026-07-01T00:00:00.000Z',
          expireDateTime: null,
        },
      ],
    });

    await expect(
      fetchWithRedis({
        endpoint: 'ContentChannelItems/GetByAttributeValue',
        queryParams: {
          attributeKey: 'Pathname',
          value: 'duplicate-example',
          loadAttributes: 'simple',
        },
        filterByDateRange: true,
      }),
    ).resolves.toEqual(inRangeItem);
  });

  it('keeps status-approved filters in the stable request and cache key', async () => {
    const { fetchRockData: fetchWithRedis } =
      await import('../fetch-rock-data');

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 123,
          startDateTime: '2026-06-01T00:00:00.000Z',
          expireDateTime: null,
        },
      ],
    });

    await fetchWithRedis({
      endpoint: 'ContentChannelItems/GetByAttributeValue',
      queryParams: {
        attributeKey: 'Pathname',
        $filter: 'ContentChannelId eq 43',
        value: 'example',
        loadAttributes: 'simple',
      },
      filterByDateRange: true,
      filterByStatusApproved: true,
    });

    const requestUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const requestFilter = new URL(requestUrl).searchParams.get('$filter');
    const cachedValue = JSON.parse(mockRedis.set.mock.calls[0][1]);

    expect(requestFilter).toContain(
      "(ContentChannelId eq 43) and (Status eq 'Approved')",
    );
    expect(requestFilter).not.toContain('StartDateTime le datetime');
    expect(cachedValue).toMatchObject({ id: 123 });
  });
});