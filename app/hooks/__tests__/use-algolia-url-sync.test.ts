import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAlgoliaUrlSync } from '../use-algolia-url-sync';

describe('useAlgoliaUrlSync', () => {
  const setSearchParams = vi.fn();
  const toParams = vi.fn((state: { q?: string }) => {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    return p;
  });

  beforeEach(() => {
    vi.useFakeTimers();
    setSearchParams.mockClear();
    toParams.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderSync(searchParams = new URLSearchParams()) {
    return renderHook(() =>
      useAlgoliaUrlSync({
        searchParams,
        setSearchParams,
        toParams,
        debounceMs: 400,
      }),
    );
  }

  it('updateUrlIfChanged calls setSearchParams when params differ', () => {
    const { result } = renderSync();
    act(() => result.current.updateUrlIfChanged({ q: 'hello' }));
    expect(setSearchParams).toHaveBeenCalledTimes(1);
  });

  it('updateUrlIfChanged does NOT call setSearchParams when params are same', () => {
    const { result } = renderSync(new URLSearchParams('q=hello'));
    act(() => result.current.updateUrlIfChanged({ q: 'hello' }));
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it('debouncedUpdateUrl delays the URL update', () => {
    const { result } = renderSync();
    act(() => result.current.debouncedUpdateUrl({ q: 'search' }));

    expect(setSearchParams).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(400));
    expect(setSearchParams).toHaveBeenCalledTimes(1);
  });

  it('debouncedUpdateUrl resets timer on rapid calls', () => {
    const { result } = renderSync();

    act(() => result.current.debouncedUpdateUrl({ q: 'a' }));
    act(() => vi.advanceTimersByTime(200));
    act(() => result.current.debouncedUpdateUrl({ q: 'ab' }));
    act(() => vi.advanceTimersByTime(200));

    // Not fired yet — reset happened
    expect(setSearchParams).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));
    expect(setSearchParams).toHaveBeenCalledTimes(1);
  });

  it('cancelDebounce prevents pending update', () => {
    const { result } = renderSync();
    act(() => result.current.debouncedUpdateUrl({ q: 'hello' }));
    act(() => result.current.cancelDebounce());
    act(() => vi.advanceTimersByTime(500));
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it('cleans up timer on unmount', () => {
    const { result, unmount } = renderSync();
    act(() => result.current.debouncedUpdateUrl({ q: 'hello' }));
    unmount();
    act(() => vi.advanceTimersByTime(500));
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it('calls setSearchParams with replace and preventScrollReset options', () => {
    const { result } = renderSync();
    act(() => result.current.updateUrlIfChanged({ q: 'test' }));
    expect(setSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), {
      replace: true,
      preventScrollReset: true,
    });
  });

  it('uses custom debounce delay', () => {
    const customSetSearchParams = vi.fn();
    const { result } = renderHook(() =>
      useAlgoliaUrlSync({
        searchParams: new URLSearchParams(),
        setSearchParams: customSetSearchParams,
        toParams,
        debounceMs: 100,
      }),
    );

    act(() => result.current.debouncedUpdateUrl({ q: 'fast' }));
    act(() => vi.advanceTimersByTime(99));
    expect(customSetSearchParams).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(customSetSearchParams).toHaveBeenCalledTimes(1);
  });
});
