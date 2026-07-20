import { beforeEach, describe, expect, it } from 'vitest';
import { buildCsp } from '../csp';
import { ROCK_PUBLIC_SITE_ORIGIN } from '../rock-config';

describe('buildCsp', () => {
  const nonce = 'test-nonce-abc123';
  let csp: string;

  beforeEach(() => {
    csp = buildCsp(nonce);
  });

  it('includes the nonce in script-src', () => {
    expect(csp).toContain(`'nonce-${nonce}'`);
  });

  it("includes 'self' in frame-src for /rock-proxy same-origin iframes", () => {
    const frameSrc = csp.split('; ').find((d) => d.startsWith('frame-src'));
    expect(frameSrc).toContain("'self'");
  });

  it('includes Rock origin in frame-src for direct Rock embeds', () => {
    const frameSrc = csp.split('; ').find((d) => d.startsWith('frame-src'));
    expect(frameSrc).toContain(ROCK_PUBLIC_SITE_ORIGIN);
  });

  it('includes GTM in frame-src', () => {
    const frameSrc = csp.split('; ').find((d) => d.startsWith('frame-src'));
    expect(frameSrc).toContain('https://www.googletagmanager.com');
  });

  it('includes Wistia wildcard in frame-src', () => {
    const frameSrc = csp.split('; ').find((d) => d.startsWith('frame-src'));
    expect(frameSrc).toContain('https://*.wistia.com');
    expect(frameSrc).toContain('https://*.wistia.net');
  });

  it("sets frame-ancestors to 'none' to prevent this site being framed", () => {
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('does not duplicate frame-src and frame-ancestors directives', () => {
    const directives = csp.split('; ');
    const frameSrcCount = directives.filter((d) =>
      d.startsWith('frame-src'),
    ).length;
    const frameAncestorsCount = directives.filter((d) =>
      d.startsWith('frame-ancestors'),
    ).length;
    expect(frameSrcCount).toBe(1);
    expect(frameAncestorsCount).toBe(1);
  });
});
