import type { ClassHitType } from './types';

function hasScheduledDate(value: ClassHitType['startDate']): value is string {
  return value != null && String(value).trim() !== '';
}

export function parseClassSessionDate(
  value: ClassHitType['startDate'],
): Date | null {
  if (!hasScheduledDate(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatClassSessionDate(
  value: ClassHitType['startDate'],
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  },
): string {
  const date = parseClassSessionDate(value);
  return date ? date.toLocaleDateString('en-US', options) : '';
}

export function parseClassSessionStartMs(hit: ClassHitType): number {
  const date = parseClassSessionDate(hit.startDate);
  return date ? date.getTime() : Number.MAX_SAFE_INTEGER;
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
