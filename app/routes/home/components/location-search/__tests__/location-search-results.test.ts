import { describe, expect, it } from 'vitest';

import {
  filterCampusHitsByQuery,
  sortCampusHitsForDistanceSearch,
} from '../location-search-results';
import type { CampusSearchHit } from '../location-search-results';

function createCampusHit(
  campusUrl: string,
  geoDistance?: number,
  overrides: Partial<CampusSearchHit> = {},
): CampusSearchHit {
  return {
    campusUrl,
    campusName: campusUrl,
    geoloc: {
      latitude: 0,
      longitude: 0,
    },
    campusLocation: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    },
    serviceTimes: '',
    _rankingInfo:
      geoDistance == null
        ? undefined
        : {
            geoDistance,
          },
    ...overrides,
  };
}

describe('sortCampusHitsForDistanceSearch', () => {
  it('moves the online campus last when a physical campus is within 80 miles', () => {
    const onlineCampus = createCampusHit('cf-everywhere', 100);
    const nearbyCampus = createCampusHit('nearby', 50 * 1609.344);
    const fartherCampus = createCampusHit('farther', 120 * 1609.344);

    const sortedHits = sortCampusHitsForDistanceSearch([
      onlineCampus,
      nearbyCampus,
      fartherCampus,
    ]);

    expect(sortedHits.map((hit) => hit.campusUrl)).toEqual([
      'nearby',
      'farther',
      'cf-everywhere',
    ]);
  });

  it('moves the online campus first when every physical campus is over 80 miles away', () => {
    const onlineCampus = createCampusHit('cf-everywhere', 100);
    const farCampus = createCampusHit('far', 81 * 1609.344);
    const fartherCampus = createCampusHit('farther', 120 * 1609.344);

    const sortedHits = sortCampusHitsForDistanceSearch([
      farCampus,
      onlineCampus,
      fartherCampus,
    ]);

    expect(sortedHits.map((hit) => hit.campusUrl)).toEqual([
      'cf-everywhere',
      'far',
      'farther',
    ]);
  });

  it('keeps the online campus last when physical distance is not available', () => {
    const onlineCampus = createCampusHit('cf-everywhere', 100);
    const physicalCampus = createCampusHit('physical');

    const sortedHits = sortCampusHitsForDistanceSearch([
      onlineCampus,
      physicalCampus,
    ]);

    expect(sortedHits.map((hit) => hit.campusUrl)).toEqual([
      'physical',
      'cf-everywhere',
    ]);
  });
});

describe('filterCampusHitsByQuery', () => {
  const hits = [
    createCampusHit('jupiter', undefined, {
      campusName: 'Jupiter',
      campusLocation: {
        street1: '1200 W Indiantown Rd',
        street2: '',
        city: 'Jupiter',
        state: 'FL',
        zip: '33458',
      },
    }),
    createCampusHit('boca-raton', undefined, {
      campusName: 'Boca Raton',
      campusLocation: {
        street1: '9087 Glades Rd',
        street2: '',
        city: 'Boca Raton',
        state: 'FL',
        zip: '33434',
      },
    }),
  ];

  it('returns all hits when the query is empty so distance/browse UIs stay intact', () => {
    expect(filterCampusHitsByQuery(hits, '')).toEqual(hits);
  });

  it('matches campus name, url, and city because Algolia keyword search cannot', () => {
    expect(
      filterCampusHitsByQuery(hits, 'jupiter').map((hit) => hit.campusUrl),
    ).toEqual(['jupiter']);
    expect(
      filterCampusHitsByQuery(hits, 'boca').map((hit) => hit.campusUrl),
    ).toEqual(['boca-raton']);
  });
});
