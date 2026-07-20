import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadClarity } from '../load-clarity';

function stubHostname(hostname: string) {
  vi.stubGlobal('location', { hostname });
}

describe('loadClarity', () => {
  beforeEach(() => {
    document
      .querySelectorAll('script[src*="clarity.ms/tag/"]')
      .forEach((el) => el.remove());
    delete window.clarity;
    stubHostname('www.christfellowship.church');
  });

  afterEach(() => {
    document
      .querySelectorAll('script[src*="clarity.ms/tag/"]')
      .forEach((el) => el.remove());
    delete window.clarity;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('injects the Clarity tag script on a production hostname', () => {
    loadClarity();

    const script = document.querySelector(
      'script[src="https://www.clarity.ms/tag/ojo9prqys0"]',
    );
    expect(script).toBeInTheDocument();
    expect(typeof window.clarity).toBe('function');
  });

  it('does not inject Clarity on preview or non-production hostnames', () => {
    stubHostname('remix-web-app-git-feature.vercel.app');
    loadClarity();

    expect(
      document.querySelector('script[src*="clarity.ms/tag/"]'),
    ).not.toBeInTheDocument();
    expect(window.clarity).toBeUndefined();
  });

  it('is idempotent when Clarity is already present', () => {
    const stub = Object.assign(function clarityStub() {}, {
      q: [] as IArguments[],
    });
    window.clarity = stub;
    loadClarity();

    expect(
      document.querySelector('script[src*="clarity.ms/tag/"]'),
    ).not.toBeInTheDocument();
  });

  it('is idempotent when a Clarity script tag already exists', () => {
    const existing = document.createElement('script');
    existing.src = 'https://www.clarity.ms/tag/ojo9prqys0';
    document.head.appendChild(existing);

    loadClarity();

    expect(
      document.querySelectorAll('script[src*="clarity.ms/tag/"]').length,
    ).toBe(1);
  });
});
