import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from '../loader';

vi.mock('~/lib/.server/fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
}));

vi.mock('~/lib/.server/error-types', () => ({
  AuthenticationError: class AuthenticationError extends Error {},
}));

const searchSingleIndex = vi.fn().mockResolvedValue({ hits: [] });

vi.mock('algoliasearch', () => ({
  algoliasearch: vi.fn(() => ({
    searchSingleIndex,
  })),
}));

import { fetchRockData } from '~/lib/.server/fetch-rock-data';

const mockFetchRockData = fetchRockData as ReturnType<typeof vi.fn>;

function makeParams(path: string, search = '') {
  return {
    params: { path },
    request: new Request(`http://localhost/class-finder/${path}${search}`),
    context: {},
  } as unknown as Parameters<typeof loader>[0];
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ALGOLIA_APP_ID = 'test-app-id';
  process.env.ALGOLIA_SEARCH_API_KEY = 'test-search-key';
  searchSingleIndex.mockResolvedValue({ hits: [] });
});

describe('class-single loader — onDemandUrl', () => {
  it('returns onDemandUrl when Rock has a value for onDemandSignUpLink', async () => {
    mockFetchRockData.mockResolvedValueOnce({
      attributeValues: {
        discussionGuide: { value: '' },
        classTrailer: { value: '' },
        onDemandSignUpLink: { value: '  https://example.com/on-demand  ' },
      },
    });

    const result = await loader(makeParams('some-class'));

    expect(result.onDemandUrl).toBe('https://example.com/on-demand');
  });

  it('returns empty string when Rock onDemandSignUpLink is blank', async () => {
    mockFetchRockData.mockResolvedValueOnce({
      attributeValues: {
        discussionGuide: { value: '' },
        classTrailer: { value: '' },
        onDemandSignUpLink: { value: '   ' },
      },
    });

    const result = await loader(makeParams('some-class'));

    expect(result.onDemandUrl).toBe('');
  });

  it('returns empty string when Rock onDemandSignUpLink is missing', async () => {
    mockFetchRockData.mockResolvedValueOnce({
      attributeValues: {
        discussionGuide: { value: '' },
        classTrailer: { value: '' },
      },
    });

    const result = await loader(makeParams('some-class'));

    expect(result.onDemandUrl).toBe('');
  });

  it('returns empty string when Rock fetch returns undefined', async () => {
    mockFetchRockData.mockResolvedValueOnce(undefined);

    const result = await loader(makeParams('some-class'));

    expect(result.onDemandUrl).toBe('');
  });

  it('returns empty string when Rock fetch throws', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      mockFetchRockData.mockRejectedValueOnce(new Error('network error'));

      const result = await loader(makeParams('some-class'));

      expect(result.onDemandUrl).toBe('');
    } finally {
      warnSpy.mockRestore();
    }
  });
});

describe('class-single loader — Algolia', () => {
  it('returns null classHit when hero search has no hits', async () => {
    mockFetchRockData.mockResolvedValueOnce(undefined);
    searchSingleIndex.mockResolvedValueOnce({ hits: [] });

    const result = await loader(makeParams('missing-class'));

    expect(result.classHit).toBeNull();
    expect(result.upcomingHits).toEqual([]);
    expect(result.groupHits).toEqual([]);
  });
});

describe('class-single loader — hero fields (Rock-first, Algolia fallback)', () => {
  const algoliaHit = {
    classType: 'Algolia Title',
    summary: 'Algolia summary',
    coverImage: { sources: [{ uri: 'https://cdn/algolia.jpg' }] },
  };

  function mockHeroHit() {
    // Hero search resolves first; subsequent upcoming/groups searches are empty.
    searchSingleIndex
      .mockResolvedValueOnce({ hits: [algoliaHit] })
      .mockResolvedValue({ hits: [] });
  }

  it('prefers Rock Defined Type values over the Algolia hit', async () => {
    mockFetchRockData.mockResolvedValueOnce({
      value: 'Rock Title',
      attributeValues: {
        summary: { value: '  Rock summary  ' },
        image: { value: '03418602-8c89-42d3-a569-18a3e6b8bec4' },
      },
    });
    mockHeroHit();

    const result = await loader(makeParams('financial-peace-university'));

    expect(result.heroTitle).toBe('Rock Title');
    expect(result.heroSummary).toBe('Rock summary');
    // Image GUID is resolved to a Rock GetImage URL rather than the Algolia uri.
    expect(result.heroCoverImageUri).toContain(
      '03418602-8c89-42d3-a569-18a3e6b8bec4',
    );
    expect(result.heroCoverImageUri).not.toBe('https://cdn/algolia.jpg');
  });

  it('leaves summary and cover image blank when Rock lacks them (no Algolia fallback); title still falls back', async () => {
    mockFetchRockData.mockResolvedValueOnce({
      value: '',
      attributeValues: {
        summary: { value: '   ' },
        image: { value: '' },
      },
    });
    mockHeroHit();

    const result = await loader(makeParams('foundations-of-faith'));

    expect(result.heroTitle).toBe('Algolia Title');
    expect(result.heroSummary).toBe('');
    expect(result.heroCoverImageUri).toBe('');
  });
});
