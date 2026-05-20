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
  it('keeps the online campus first before a distance search', () => {
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

  it('uses distance ordering after a nearby zip or GPS search', () => {
    const onlineCampus = createCampusHit('cf-everywhere', 100);
    const nearbyCampus = createCampusHit('nearby', 5 * 1609.344);
    const fartherCampus = createCampusHit('farther', 100 * 1609.344);

    const displayItems = getLocationCardDisplayItems(
      [onlineCampus, nearbyCampus, fartherCampus],
      true,
    );

    expect(displayItems.map((hit) => hit.campusUrl)).toEqual([
      'nearby',
      'farther',
      'cf-everywhere',
    ]);
  });
});
