import { describe, expect, it } from 'vitest';

import {
  getLocationCardDisplayItems,
  type CampusHit,
} from '../location-card-list.partial';

function createCampusHit(campusUrl: string, geoDistance?: number): CampusHit {
  return {
    campusUrl,
    campusName: campusUrl === 'cf-everywhere' ? 'Online' : campusUrl,
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
  };
}

describe('getLocationCardDisplayItems', () => {
  it('keeps the online campus first on the /location page', () => {
    const onlineCampus = createCampusHit('cf-everywhere');
    const nearbyCampus = createCampusHit('nearby');

    const displayItems = getLocationCardDisplayItems([
      nearbyCampus,
      onlineCampus,
    ]);

    expect(displayItems.map((hit) => hit.campusUrl)).toEqual([
      'cf-everywhere',
      'nearby',
    ]);
  });

  it('keeps online first after a zip or GPS search (physical hits stay in input order)', () => {
    const onlineCampus = createCampusHit('cf-everywhere', 100);
    const nearbyCampus = createCampusHit('nearby', 5 * 1609.344);
    const fartherCampus = createCampusHit('farther', 100 * 1609.344);

    const displayItems = getLocationCardDisplayItems([
      nearbyCampus,
      fartherCampus,
      onlineCampus,
    ]);

    expect(displayItems.map((hit) => hit.campusUrl)).toEqual([
      'cf-everywhere',
      'nearby',
      'farther',
    ]);
  });
});
