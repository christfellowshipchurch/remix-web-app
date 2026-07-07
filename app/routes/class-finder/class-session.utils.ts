import type { ClassHitType } from './types';

function hasScheduledDate(value: ClassHitType['startDate']): boolean {
  return value != null && String(value).trim() !== '';
}

/**
 * True when an Algolia classes record represents a schedulable session (both
 * `startDate` and `endDate` are set). Catalog / interest-only rows omit dates.
 */
export function isScheduledClassSession(hit: ClassHitType): boolean {
  return hasScheduledDate(hit.startDate) && hasScheduledDate(hit.endDate);
}

export function filterScheduledClassSessions(
  hits: ClassHitType[],
): ClassHitType[] {
  return hits.filter(isScheduledClassSession);
}
