import { afterEach, describe, expect, it, vi } from 'vitest';
import { isProductionHost, PRODUCTION_HOSTS } from '../analytics-host';

describe('PRODUCTION_HOSTS', () => {
  it('lists only the canonical production hostnames', () => {
    expect(PRODUCTION_HOSTS).toEqual([
      'www.christfellowship.church',
      'christfellowship.church',
    ]);
  });
});

describe('isProductionHost', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true for www production hostname', () => {
    vi.stubGlobal('location', { hostname: 'www.christfellowship.church' });
    expect(isProductionHost()).toBe(true);
  });

  it('returns true for apex production hostname', () => {
    vi.stubGlobal('location', { hostname: 'christfellowship.church' });
    expect(isProductionHost()).toBe(true);
  });

  it('returns false for preview vercel.app hostnames', () => {
    vi.stubGlobal('location', {
      hostname: 'remix-web-app-git-feature.vercel.app',
    });
    expect(isProductionHost()).toBe(false);
  });

  it('returns false for localhost', () => {
    vi.stubGlobal('location', { hostname: 'localhost' });
    expect(isProductionHost()).toBe(false);
  });

  it('returns false when window is undefined', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error intentional SSR simulation
    delete globalThis.window;
    expect(isProductionHost()).toBe(false);
    globalThis.window = originalWindow;
  });
});
