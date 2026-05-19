import type { CampusHitType } from './location-hit';

const METERS_PER_MILE = 1609.344;
const ONLINE_CAMPUS_URL = 'cf-everywhere';
const ONLINE_FIRST_DISTANCE_THRESHOLD_MILES = 80;

export type CampusSearchHit = CampusHitType & {
  objectID?: string;
  _rankingInfo?: {
    geoDistance?: number;
  };
};

const onlineFirstDistanceThresholdMeters =
  ONLINE_FIRST_DISTANCE_THRESHOLD_MILES * METERS_PER_MILE;

function isOnlineCampus(hit: CampusSearchHit) {
  return hit.campusUrl === ONLINE_CAMPUS_URL;
}

function getClosestPhysicalDistanceMeters(hits: CampusSearchHit[]) {
  return hits.reduce<number | null>((closestDistance, hit) => {
    if (isOnlineCampus(hit)) return closestDistance;

    const distance = hit._rankingInfo?.geoDistance;
    if (typeof distance !== 'number' || !Number.isFinite(distance)) {
      return closestDistance;
    }

    return closestDistance === null
      ? distance
      : Math.min(closestDistance, distance);
  }, null);
}

export function sortCampusHitsForDistanceSearch(hits: CampusSearchHit[]) {
  const onlineHits = hits.filter(isOnlineCampus);
  if (onlineHits.length === 0) return hits;

  const physicalHits = hits.filter((hit) => !isOnlineCampus(hit));
  const closestPhysicalDistanceMeters =
    getClosestPhysicalDistanceMeters(physicalHits);

  if (
    closestPhysicalDistanceMeters != null &&
    closestPhysicalDistanceMeters > onlineFirstDistanceThresholdMeters
  ) {
    return [...onlineHits, ...physicalHits];
  }

  return [...physicalHits, ...onlineHits];
}
