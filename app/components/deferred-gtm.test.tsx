import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeferredGtm } from './deferred-gtm';

describe('DeferredGtm', () => {
  const gtmId = 'GTM-TEST123';

  beforeEach(() => {
    document
      .querySelectorAll('script[src*="googletagmanager.com/gtm.js"]')
      .forEach((el) => el.remove());
    vi.useFakeTimers();
  });

  afterEach(() => {
    document
      .querySelectorAll('script[src*="googletagmanager.com/gtm.js"]')
      .forEach((el) => el.remove());
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('injects the GTM script for the given container id', () => {
    render(<DeferredGtm gtmId={gtmId} />);
    vi.runAllTimers();

    const scripts = document.querySelectorAll(
      `script[src="https://www.googletagmanager.com/gtm.js?id=${gtmId}"]`,
    );
    expect(scripts).toHaveLength(1);
  });

  it('does not inject a duplicate script when mounted repeatedly for the same id', () => {
    const { unmount } = render(<DeferredGtm gtmId={gtmId} />);
    vi.runAllTimers();
    unmount();

    render(<DeferredGtm gtmId={gtmId} />);
    vi.runAllTimers();

    const scripts = document.querySelectorAll(
      `script[src="https://www.googletagmanager.com/gtm.js?id=${gtmId}"]`,
    );
    expect(scripts).toHaveLength(1);
  });

  it('does not inject a second script when one already exists in the document', () => {
    const existing = document.createElement('script');
    existing.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(existing);

    render(<DeferredGtm gtmId={gtmId} />);
    vi.runAllTimers();

    expect(
      document.querySelectorAll(
        `script[src="https://www.googletagmanager.com/gtm.js?id=${gtmId}"]`,
      ),
    ).toHaveLength(1);
  });
});
