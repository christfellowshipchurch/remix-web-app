import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useScrollToSearchResultsOnLoad } from '../use-scroll-to-search-results-on-load';

describe('useScrollToSearchResultsOnLoad', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does not scroll when no active filters', () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, 'querySelector').mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);

    const hasActiveFilters = vi.fn().mockReturnValue(false);
    renderHook(() =>
      useScrollToSearchResultsOnLoad(new URLSearchParams(), hasActiveFilters),
    );

    vi.advanceTimersByTime(500);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('scrolls to target when active filters exist', () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, 'querySelector').mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    const hasActiveFilters = vi.fn().mockReturnValue(true);
    renderHook(() =>
      useScrollToSearchResultsOnLoad(
        new URLSearchParams('q=test'),
        hasActiveFilters,
      ),
    );

    vi.advanceTimersByTime(500);
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('does not scroll when target element does not exist', () => {
    vi.spyOn(document, 'querySelector').mockReturnValue(null);

    const hasActiveFilters = vi.fn().mockReturnValue(true);
    // Should not throw even when element is missing
    expect(() => {
      renderHook(() =>
        useScrollToSearchResultsOnLoad(
          new URLSearchParams('q=test'),
          hasActiveFilters,
        ),
      );
      vi.advanceTimersByTime(500);
    }).not.toThrow();
  });

  it('only scrolls once (guarded by hasScrolledRef)', () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, 'querySelector').mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    const hasActiveFilters = vi.fn().mockReturnValue(true);
    const { rerender } = renderHook(
      ({ params }: { params: URLSearchParams }) =>
        useScrollToSearchResultsOnLoad(params, hasActiveFilters),
      { initialProps: { params: new URLSearchParams('q=test') } },
    );

    vi.advanceTimersByTime(500);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);

    // Rerender with the same params — should not scroll again
    rerender({ params: new URLSearchParams('q=test') });
    vi.advanceTimersByTime(500);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const hasActiveFilters = vi.fn().mockReturnValue(true);

    const { unmount } = renderHook(() =>
      useScrollToSearchResultsOnLoad(
        new URLSearchParams('q=test'),
        hasActiveFilters,
      ),
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
