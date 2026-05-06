import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loader, normalizeGroupGuid } from '../loader';

const { searchForHits } = vi.hoisted(() => ({
  searchForHits: vi.fn(),
}));

vi.mock('algoliasearch', () => ({
  algoliasearch: vi.fn(() => ({
    searchForHits,
  })),
}));

function makeLoaderArgs(path: string) {
  return {
    params: { path },
    request: new Request(`http://localhost/group-finder/${path}`),
    context: {},
  } as unknown as Parameters<typeof loader>[0];
}

function makeSearchResponse(hits: Record<string, unknown>[]) {
  return {
    results: [
      {
        hits,
      },
    ],
  };
}

describe('group-single loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ALGOLIA_APP_ID = 'test-app-id';
    process.env.ALGOLIA_SEARCH_API_KEY = 'test-search-key';
  });

  it('normalizes group GUIDs for exact search fallback comparison', () => {
    expect(normalizeGroupGuid('  abc-def  ')).toBe('ABC-DEF');
  });

  it('resolves current groupGuid URLs through an exact GUID search fallback', async () => {
    const pathGuid = 'abc-def';
    const group = {
      objectID: 'legacy-object-id',
      groupGuid: 'ABC-DEF',
      title: 'Young Adults',
    };

    searchForHits
      .mockResolvedValueOnce(makeSearchResponse([]))
      .mockResolvedValueOnce(
        makeSearchResponse([{ groupGuid: 'not-it' }, group]),
      );

    const response = await loader(makeLoaderArgs(pathGuid));
    const data = await response.json();

    expect(searchForHits).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'dev_Groups',
        params: {
          filters: 'groupGuid:"abc-def"',
          hitsPerPage: 1,
        },
      },
    ]);
    expect(searchForHits).toHaveBeenNthCalledWith(2, [
      {
        indexName: 'dev_Groups',
        params: {
          query: pathGuid,
          hitsPerPage: 50,
        },
      },
    ]);
    expect(data.group).toEqual(group);
  });

  it('keeps legacy objectID URLs working when the path is not a groupGuid', async () => {
    const legacyObjectId = 'legacy-object-id';
    const group = {
      objectID: legacyObjectId,
      groupGuid: 'ABC-DEF',
      title: 'Young Adults',
    };

    searchForHits
      .mockResolvedValueOnce(makeSearchResponse([]))
      .mockResolvedValueOnce(makeSearchResponse([]))
      .mockResolvedValueOnce(makeSearchResponse([group]));

    const response = await loader(makeLoaderArgs(legacyObjectId));
    const data = await response.json();

    expect(searchForHits).toHaveBeenNthCalledWith(3, [
      {
        indexName: 'dev_Groups',
        params: {
          filters: 'objectID:"legacy-object-id"',
          hitsPerPage: 1,
        },
      },
    ]);
    expect(data.group).toEqual(group);
  });
});
