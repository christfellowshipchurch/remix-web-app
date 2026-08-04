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
  it('shows the online campus last when no distance info is available', () => {
    const onlineCampus = createCampusHit('cf-everywhere');
    const nearbyCampus = createCampusHit('nearby');

    const displayItems = getLocationCardDisplayItems([
      onlineCampus,
      nearbyCampus,
    ]);

    expect(displayItems.map((hit) => hit.campusUrl)).toEqual([
      'nearby',
      'cf-everywhere',
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
      'first',
      'second',
      'third',
      'cf-everywhere',
    ]);
  });

  it('shows online last when the closest campus is within 80 miles', () => {
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
      'nearby',
      'farther',
      'cf-everywhere',
    ]);
  });

  it('shows online first when the closest campus is over 80 miles away', () => {
    const onlineCampus = createCampusHit('cf-everywhere', { geoDistance: 100 });
    const fartherCampus = createCampusHit('farther', {
      geoDistance: 100 * 1609.344,
    });
    const farthestCampus = createCampusHit('farthest', {
      geoDistance: 200 * 1609.344,
    });

    const displayItems = getLocationCardDisplayItems(
      [fartherCampus, farthestCampus, onlineCampus],
      { sortByGeo: true },
    );

    expect(displayItems.map((hit) => hit.campusUrl)).toEqual([
      'cf-everywhere',
      'farther',
      'farthest',
    ]);
  });
});
