import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMapDimensions } from '../use-map-dimensions';

describe('useMapDimensions', () => {
  it('returns ref, dimensions, and offset', () => {
    const { result } = renderHook(() => useMapDimensions());
    expect(result.current.ref).toBeDefined();
    expect(result.current.dimensions).toBeDefined();
    expect(typeof result.current.offset).toBe('number');
  });

  it('initializes with zero dimensions when no element is attached', () => {
    const { result } = renderHook(() => useMapDimensions());
    expect(result.current.dimensions.width).toBe(0);
    expect(result.current.dimensions.height).toBe(0);
  });

  it('initializes offset as zero when dimensions are zero', () => {
    const { result } = renderHook(() => useMapDimensions());
    // offset = width * (140/1230), so offset = 0 when width = 0
    expect(result.current.offset).toBe(0);
  });

  it('ref is initially null', () => {
    const { result } = renderHook(() => useMapDimensions());
    // ref.current is null before attaching to a DOM element
    expect(result.current.ref.current).toBeNull();
  });
});
