import { describe, expect, it } from 'vitest';
import { resolveRockIframeNavigateUrl } from '../rock-iframe-navigate';

describe('resolveRockIframeNavigateUrl', () => {
  const origin = 'https://christfellowship.church';

  it('accepts same-origin paths', () => {
    expect(resolveRockIframeNavigateUrl('/volunteer', origin)).toBe(
      '/volunteer',
    );
  });

  it('accepts absolute production URLs', () => {
    expect(
      resolveRockIframeNavigateUrl(
        'https://christfellowship.church/volunteer',
        origin,
      ),
    ).toBe('https://christfellowship.church/volunteer');
  });

  it('rejects external origins', () => {
    expect(
      resolveRockIframeNavigateUrl('https://example.com/volunteer', origin),
    ).toBeNull();
  });

  it('rejects protocol-relative URLs', () => {
    expect(
      resolveRockIframeNavigateUrl('//example.com/volunteer', origin),
    ).toBeNull();
  });
});
