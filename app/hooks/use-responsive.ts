import { useMediaQuery } from "react-responsive";
import { useHydrated } from "./use-hydrated";

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export function useResponsive() {
  const isHydrated = useHydrated();

  const isSmall = useMediaQuery({ maxWidth: breakpoints.md - 1 });
  const isMedium = useMediaQuery({
    minWidth: breakpoints.md,
    maxWidth: breakpoints.lg - 1,
  });
  const isLarge = useMediaQuery({ minWidth: breakpoints.lg });
  const isXLarge = useMediaQuery({ minWidth: breakpoints["xl"] });
  const isXXLarge = useMediaQuery({ minWidth: breakpoints["2xl"] });

  // Return mobile-first defaults when not hydrated
  if (!isHydrated) {
    return {
      isSmall: true,
      isMedium: false,
      isLarge: false,
      isXLarge: false,
      isXXLarge: false,
      breakpoints,
    };
  }

  return {
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    isXXLarge,
    breakpoints,
  };
}
