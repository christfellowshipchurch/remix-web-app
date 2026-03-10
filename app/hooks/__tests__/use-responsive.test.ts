import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useResponsive, breakpoints } from "../use-responsive";

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    writable: true,
    configurable: true,
  });
  window.dispatchEvent(new Event("resize"));
}

afterEach(() => {
  // Reset to a known desktop width
  setWindowWidth(1024);
});

describe("useResponsive", () => {
  it("exposes the breakpoints object", () => {
    const { result } = renderHook(() => useResponsive());
    expect(result.current.breakpoints).toBe(breakpoints);
  });

  it("detects xSmall viewport (< 640)", () => {
    act(() => setWindowWidth(480));
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isXSmall).toBe(true);
    expect(result.current.isSmall).toBe(true);
    expect(result.current.isMedium).toBe(false);
    expect(result.current.isLarge).toBe(false);
  });

  it("detects small viewport (640-767)", () => {
    act(() => setWindowWidth(640));
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isXSmall).toBe(false);
    expect(result.current.isSmall).toBe(true);
    expect(result.current.isMedium).toBe(false);
  });

  it("detects medium viewport (768-1023)", () => {
    act(() => setWindowWidth(900));
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isMedium).toBe(true);
    expect(result.current.isSmall).toBe(false);
    expect(result.current.isLarge).toBe(false);
  });

  it("detects large viewport (>= 1024)", () => {
    act(() => setWindowWidth(1200));
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isLarge).toBe(true);
    expect(result.current.isMedium).toBe(false);
    expect(result.current.isXLarge).toBe(false);
  });

  it("detects xLarge viewport (>= 1280)", () => {
    act(() => setWindowWidth(1400));
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isXLarge).toBe(true);
    expect(result.current.isXXLarge).toBe(false);
  });

  it("detects xxLarge viewport (>= 1536)", () => {
    act(() => setWindowWidth(1600));
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isXXLarge).toBe(true);
  });

  it("updates on window resize", () => {
    act(() => setWindowWidth(500));
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isXSmall).toBe(true);

    act(() => setWindowWidth(1200));
    expect(result.current.isXSmall).toBe(false);
    expect(result.current.isLarge).toBe(true);
  });

  it("cleans up resize listener on unmount", () => {
    const removeListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useResponsive());
    unmount();
    expect(removeListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
    removeListenerSpy.mockRestore();
  });

  it("handles exact boundary at 640 (sm breakpoint)", () => {
    act(() => setWindowWidth(640));
    const { result } = renderHook(() => useResponsive());
    // isXSmall = width < 640 → false at exactly 640
    expect(result.current.isXSmall).toBe(false);
    // isSmall = width < 768 → true at 640
    expect(result.current.isSmall).toBe(true);
  });

  it("handles exact boundary at 1024 (lg breakpoint)", () => {
    act(() => setWindowWidth(1024));
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isLarge).toBe(true);
    expect(result.current.isMedium).toBe(false);
  });
});
