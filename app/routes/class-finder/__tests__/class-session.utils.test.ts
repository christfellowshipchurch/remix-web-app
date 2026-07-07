import { describe, expect, it } from 'vitest';

import type { ClassHitType } from '../types';
import {
  filterScheduledClassSessions,
  isScheduledClassSession,
} from '../class-session.utils';

function makeHit(
  overrides: Partial<ClassHitType> = {},
): ClassHitType {
  return {
    objectID: '1',
    title: 'Class',
    classType: 'Class',
    pathName: 'class',
    campus: 'Palm Beach Gardens',
    groupId: 1,
    subtitle: '',
    summary: 'Summary',
    coverImage: { sources: [] },
    _geoloc: { lat: 0, lng: 0 },
    startDate: '2026-01-01',
    endDate: '2026-03-01',
    schedule: 'Sunday at 8:00 AM',
    topic: 'Spiritual Growth',
    language: 'English',
    format: 'In-Person',
    ...overrides,
  };
}

describe('isScheduledClassSession', () => {
  it('returns false when both startDate and endDate are null', () => {
    expect(
      isScheduledClassSession(
        makeHit({ startDate: null, endDate: null }),
      ),
    ).toBe(false);
  });

  it('returns false when either date is missing', () => {
    expect(
      isScheduledClassSession(makeHit({ startDate: '2026-01-01', endDate: null })),
    ).toBe(false);
    expect(
      isScheduledClassSession(makeHit({ startDate: null, endDate: '2026-03-01' })),
    ).toBe(false);
  });

  it('returns true when both dates are set', () => {
    expect(
      isScheduledClassSession(
        makeHit({ startDate: '2026-01-01', endDate: '2026-03-01' }),
      ),
    ).toBe(true);
  });
});

describe('filterScheduledClassSessions', () => {
  it('removes catalog-only rows without session dates', () => {
    const hits = [
      makeHit({ objectID: 'catalog', startDate: null, endDate: null }),
      makeHit({ objectID: 'session' }),
    ];

    expect(filterScheduledClassSessions(hits).map((h) => h.objectID)).toEqual([
      'session',
    ]);
  });
});
