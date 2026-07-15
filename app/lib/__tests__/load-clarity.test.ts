import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadClarity } from '../load-clarity';

describe('loadClarity', () => {
  beforeEach(() => {
    document
      .querySelectorAll('script[src*="clarity.ms/tag/"]')
      .forEach((el) => el.remove());
    delete window.clarity;
  });

  afterEach(() => {
    document
      .querySelectorAll('script[src*="clarity.ms/tag/"]')
      .forEach((el) => el.remove());
    delete window.clarity;
    vi.restoreAllMocks();
  });

  it('injects the Clarity tag script with the default project id', () => {
    loadClarity();

    const script = document.querySelector(
      'script[src="https://www.clarity.ms/tag/ojo9prqys0"]',
    );
    expect(script).toBeInTheDocument();
    expect(typeof window.clarity).toBe('function');
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
