import { describe, expect, it } from 'vitest';

import { filterLocationHitsByQuery } from '../search-locations';

describe('filterLocationHitsByQuery', () => {
  const hits = [
    {
      campusName: 'Christ Fellowship Jupiter',
      campusUrl: 'jupiter',
      campusLocation: { city: 'Jupiter', state: 'FL' },
    },
    {
      campusName: 'Christ Fellowship Boca Raton',
      campusUrl: 'boca-raton',
      campusLocation: { city: 'Boca Raton', state: 'FL' },
    },
    {
      campusName: 'Missing URL Campus',
      campusUrl: '',
    },
  ];

  it('returns all valid campuses when query is empty', () => {
    expect(filterLocationHitsByQuery(hits, '')).toHaveLength(2);
  });

  it('matches campus names and urls from a keyword query', () => {
    expect(filterLocationHitsByQuery(hits, 'jupiter').map((hit) => hit.campusUrl)).toEqual([
      'jupiter',
    ]);
    expect(
      filterLocationHitsByQuery(hits, 'boca').map((hit) => hit.campusUrl),
    ).toEqual(['boca-raton']);
  });

  it('matches city names from a keyword query', () => {
    expect(
      filterLocationHitsByQuery(hits, 'boca raton').map((hit) => hit.campusUrl),
    ).toEqual(['boca-raton']);
  });
});
