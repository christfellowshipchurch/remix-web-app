import { describe, expect, it } from 'vitest';

import {
  getLocationCardDisplayItems,
  type CampusHit,
} from '../location-card-list.partial';

function createCampusHit(
  campusUrl: string,
  options?: { geoDistance?: number; order?: number | string },
): CampusHit {
  const { geoDistance, order } = options ?? {};

  return {
    campusUrl,
    campusName: campusUrl === 'cf-everywhere' ? 'Online' : campusUrl,
    order,
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

  it('sorts physical campuses by order when geo search is inactive', () => {
    const onlineCampus = createCampusHit('cf-everywhere', { order: 99 });
    const thirdCampus = createCampusHit('third', { order: 3 });
    const firstCampus = createCampusHit('first', { order: 1 });
    const secondCampus = createCampusHit('second', { order: 2 });

    const displayItems = getLocationCardDisplayItems([
      thirdCampus,
      onlineCampus,
      secondCampus,
      firstCampus,
    ]);

    expect(displayItems.map((hit) => hit.campusUrl)).toEqual([
      'cf-everywhere',
      'first',
      'second',
      'third',
    ]);
  });

  it('keeps online first after a zip or GPS search (physical hits stay in input order)', () => {
    const onlineCampus = createCampusHit('cf-everywhere', { geoDistance: 100 });
    const nearbyCampus = createCampusHit('nearby', {
      geoDistance: 5 * 1609.344,
      order: 2,
    });
    const fartherCampus = createCampusHit('farther', {
      geoDistance: 100 * 1609.344,
      order: 1,
    });

    const displayItems = getLocationCardDisplayItems(
      [nearbyCampus, fartherCampus, onlineCampus],
      { sortByGeo: true },
    );

    expect(displayItems.map((hit) => hit.campusUrl)).toEqual([
      'cf-everywhere',
      'nearby',
      'farther',
    ]);
  });
});
