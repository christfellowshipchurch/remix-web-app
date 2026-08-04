import { describe, expect, it } from 'vitest';
import type { ClassHitType } from '../../../types';
import {
  groupClassTypeHits,
  isCompleteClassFinderHit,
  syntheticHitsFromGrouped,
} from '../group-class-type-hits';

function makeHit(
  overrides: Partial<ClassHitType> &
    Pick<ClassHitType, 'objectID' | 'pathName'>,
): ClassHitType {
  return {
    title: 'Class Title',
    classType: 'Class Type',
    campus: 'Palm Beach Gardens',
    groupId: 1,
    subtitle: 'Subtitle',
    summary: 'Summary',
    coverImage: { sources: [{ uri: 'https://algolia.example/cover.jpg' }] },
    _geoloc: { lat: 0, lng: 0 },
    startDate: '',
    endDate: '',
    schedule: '',
    topic: 'Spiritual Growth',
    language: 'English',
    format: 'In-Person',
    ...overrides,
  };
}

describe('isCompleteClassFinderHit', () => {
  it('requires a non-empty pathName and classType', () => {
    expect(
      isCompleteClassFinderHit(
        makeHit({ objectID: '1', pathName: 'marriage-matters' }),
      ),
    ).toBe(true);
    expect(
      isCompleteClassFinderHit(
        makeHit({
          objectID: '2',
          pathName: '',
          classType: 'Marriage Matters',
        }),
      ),
    ).toBe(false);
    expect(
      isCompleteClassFinderHit(
        makeHit({
          objectID: '3',
          pathName: 'marriage-matters',
          classType: '',
        }),
      ),
    ).toBe(false);
  });
});

describe('groupClassTypeHits', () => {
  it('excludes incomplete hits missing pathName or classType', () => {
    const hits = [
      makeHit({ objectID: 'good', pathName: 'marriage-matters' }),
      makeHit({
        objectID: '62825140002',
        pathName: '',
        classType: '',
        title: 'Marriage Matters - Jupiter - Wednesday - 6:30pm - August 26',
        topic: '' as ClassHitType['topic'],
        coverImage: { sources: [] },
      }),
    ];

    const grouped = groupClassTypeHits(hits, {});

    expect(grouped).toHaveLength(1);
    expect(grouped[0].pathName).toBe('marriage-matters');
  });

  it('uses Rock cover image for grouped class rows when available', () => {
    const hits = [
      makeHit({ objectID: '1', pathName: 'financial-peace' }),
      makeHit({
        objectID: '2',
        pathName: 'financial-peace',
        campus: 'Stuart',
        coverImage: { sources: [{ uri: 'https://algolia.example/other.jpg' }] },
      }),
    ];

    const grouped = groupClassTypeHits(hits, {
      'financial-peace': 'https://rock.example/financial-peace.jpg',
    });

    expect(grouped).toHaveLength(1);
    expect(grouped[0].coverImage).toBe(
      'https://rock.example/financial-peace.jpg',
    );
  });

  it('falls back to the first Algolia cover image when Rock has no match', () => {
    const hits = [makeHit({ objectID: '1', pathName: 'marriage-101' })];

    const grouped = groupClassTypeHits(hits, {});

    expect(grouped[0].coverImage).toBe('https://algolia.example/cover.jpg');
  });

  it('uses summary as the synthetic card description when subtitle is empty', () => {
    const hits = [
      makeHit({
        objectID: '1',
        pathName: 'before-you-say-i-do',
        subtitle: '',
        summary: 'A Class for Dating & Engaged Couples',
      }),
    ];

    const grouped = groupClassTypeHits(hits, {});
    const synthetic = syntheticHitsFromGrouped(grouped);

    expect(synthetic[0].summary).toBe('A Class for Dating & Engaged Couples');
    expect(synthetic[0].subtitle).toBe('');
  });

  it('does not copy the class title into subtitle on synthetic cards', () => {
    const hits = [
      makeHit({
        objectID: '1',
        pathName: 'before-you-say-i-do',
        classType: 'Before You Say I Do',
        subtitle: '',
        summary: 'A Class for Dating & Engaged Couples',
      }),
    ];

    const synthetic = syntheticHitsFromGrouped(groupClassTypeHits(hits, {}));

    expect(synthetic[0].title).toBe('Before You Say I Do');
    expect(synthetic[0].subtitle).not.toBe('Before You Say I Do');
  });
});
