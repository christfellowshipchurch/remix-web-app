import { describe, expect, it } from 'vitest';
import type { ClassHitType } from '../../../types';
import { groupClassTypeHits, syntheticHitsFromGrouped } from '../group-class-type-hits';

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

describe('groupClassTypeHits', () => {
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
