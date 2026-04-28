import { useEffect, useState } from 'react';

export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function useResponsive() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize(); // set initial width
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
