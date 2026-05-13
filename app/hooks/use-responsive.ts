import { useSyncExternalStore } from 'react';

export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

function subscribe(onStoreChange: () => void) {
  window.addEventListener('resize', onStoreChange);
  return () => window.removeEventListener('resize', onStoreChange);
}

function getSnapshot() {
  return window.innerWidth;
}

function getServerSnapshot() {
  return null;
}

export function useResponsive() {
  const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (width === null) {
    return {
      isXSmall: false,
      isSmall: false,
      isMedium: false,
      isLarge: false,
      isXLarge: false,
      isXXLarge: false,
      breakpoints,
    };
  }

  return {
    isXSmall: width < breakpoints.sm,
    isSmall: width < breakpoints.md,
    isMedium: width >= breakpoints.md && width < breakpoints.lg,
    isLarge: width >= breakpoints.lg,
    isXLarge: width >= breakpoints.xl,
    isXXLarge: width >= breakpoints['2xl'],
    breakpoints,
  };
}
