import { describe, expect, it } from 'vitest';

import {
  getSearchHitPathname,
  internalPathFromMalformedAbsoluteUrl,
  isExternalSearchHref,
  resolveSearchHitLink,
} from '../search-hit-links';

describe('search hit links', () => {
  it('treats dotted hostnames as external', () => {
    expect(isExternalSearchHref('https://www.example.com/events/diesel')).toBe(
      true,
    );
    expect(isExternalSearchHref('http://christfellowship.church/page')).toBe(
      true,
    );
  });

  it('treats scheme-only paths like https://events/diesel as internal', () => {
    expect(isExternalSearchHref('https://events/diesel')).toBe(false);
    expect(internalPathFromMalformedAbsoluteUrl('https://events/diesel')).toBe(
      '/events/diesel',
    );
  });

  it('normalizes redirect card paths', () => {
    expect(getSearchHitPathname('Redirect Card', '/events/diesel')).toBe(
      '/events/diesel',
    );
    expect(getSearchHitPathname('Redirect Card', 'events/diesel')).toBe(
      '/events/diesel',
    );
    expect(getSearchHitPathname('Redirect Card', 'https://events/diesel')).toBe(
      '/events/diesel',
    );
  });

  it('preserves real external redirect card URLs', () => {
    expect(
      resolveSearchHitLink('Redirect Card', 'https://www.example.com/off-site'),
    ).toEqual({
      to: 'https://www.example.com/off-site',
      isExternal: true,
    });
  });

  it('resolves internal redirect cards for in-app navigation', () => {
    expect(resolveSearchHitLink('Redirect Card', '/events/diesel')).toEqual({
      to: '/events/diesel',
      isExternal: false,
    });
  });
});
