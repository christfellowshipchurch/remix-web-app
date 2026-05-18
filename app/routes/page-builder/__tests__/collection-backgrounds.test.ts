import { describe, expect, it } from 'vitest';
import { getCarouselCollectionBackgrounds } from '../components/builder-utils';
import { PageBuilderSection } from '../types';

function makeSection(
  id: string,
  type: PageBuilderSection['type'],
): PageBuilderSection {
  return { id, name: id, content: '', type };
}

describe('getCarouselCollectionBackgrounds', () => {
  it('returns an empty map when there are no sections', () => {
    const result = getCarouselCollectionBackgrounds([]);
    expect(result.size).toBe(0);
  });

  it('returns an empty map when there are no carousel collection sections', () => {
    const sections = [
      makeSection('a', 'CONTENT_BLOCK'),
      makeSection('b', 'FAQs'),
    ];
    const result = getCarouselCollectionBackgrounds(sections);
    expect(result.size).toBe(0);
  });

  it('assigns white to a single isolated collection section', () => {
    const sections = [makeSection('a', 'RESOURCE_COLLECTION')];
    const result = getCarouselCollectionBackgrounds(sections);
    expect(result.get('a')).toBe('white');
  });

  it('assigns white to an isolated EVENT_COLLECTION', () => {
    const sections = [makeSection('a', 'EVENT_COLLECTION')];
    const result = getCarouselCollectionBackgrounds(sections);
    expect(result.get('a')).toBe('white');
  });

  it('alternates white then gray for an adjacent pair', () => {
    const sections = [
      makeSection('a', 'RESOURCE_COLLECTION'),
      makeSection('b', 'EVENT_COLLECTION'),
    ];
    const result = getCarouselCollectionBackgrounds(sections);
    expect(result.get('a')).toBe('white');
    expect(result.get('b')).toBe('gray');
  });

  it('alternates white, gray, white for a run of three', () => {
    const sections = [
      makeSection('a', 'RESOURCE_COLLECTION'),
      makeSection('b', 'EVENT_COLLECTION'),
      makeSection('c', 'RESOURCE_COLLECTION'),
    ];
    const result = getCarouselCollectionBackgrounds(sections);
    expect(result.get('a')).toBe('white');
    expect(result.get('b')).toBe('gray');
    expect(result.get('c')).toBe('white');
  });

  it('resets to white after a non-collection section breaks the run', () => {
    const sections = [
      makeSection('a', 'RESOURCE_COLLECTION'),
      makeSection('b', 'EVENT_COLLECTION'),
      makeSection('x', 'CONTENT_BLOCK'),
      makeSection('c', 'RESOURCE_COLLECTION'),
    ];
    const result = getCarouselCollectionBackgrounds(sections);
    expect(result.get('a')).toBe('white');
    expect(result.get('b')).toBe('gray');
    expect(result.has('x')).toBe(false);
    expect(result.get('c')).toBe('white');
  });

  it('treats mixed RESOURCE_COLLECTION and EVENT_COLLECTION as one alternating run', () => {
    const sections = [
      makeSection('a', 'RESOURCE_COLLECTION'),
      makeSection('b', 'EVENT_COLLECTION'),
      makeSection('c', 'RESOURCE_COLLECTION'),
      makeSection('d', 'EVENT_COLLECTION'),
    ];
    const result = getCarouselCollectionBackgrounds(sections);
    expect(result.get('a')).toBe('white');
    expect(result.get('b')).toBe('gray');
    expect(result.get('c')).toBe('white');
    expect(result.get('d')).toBe('gray');
  });

  it('does not include CTA_COLLECTION in the alternating pattern', () => {
    const sections = [
      makeSection('a', 'RESOURCE_COLLECTION'),
      makeSection('b', 'CTA_COLLECTION'),
      makeSection('c', 'EVENT_COLLECTION'),
    ];
    const result = getCarouselCollectionBackgrounds(sections);
    // CTA breaks the run → 'a' is alone (white), 'c' starts a new run (white)
    expect(result.get('a')).toBe('white');
    expect(result.has('b')).toBe(false);
    expect(result.get('c')).toBe('white');
  });
});
