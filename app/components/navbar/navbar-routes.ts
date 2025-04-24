import { useResponsive } from "~/hooks/use-responsive";

// config/navbar-routes.ts
type RoutePattern = {
  path: string;
  isDynamic?: boolean;
  mobileOnly?: boolean;
};

// Define routes that should use dark mode
// Include both static and dynamic routes
export const darkModeRoutes: RoutePattern[] = [
  // This is to account for the homepage being dark mode only on mobile/iPad -> Designed this way in Figma
  // { path: "/", mobileOnly: true },
  { path: "/about" },
  { path: "/events" },
  { path: "/locations" },
  { path: "/locations/", isDynamic: true }, // This will match /locations/[slug]
  { path: "/messages" },
  { path: "/messages/", isDynamic: true }, // This will match /messages/[slug]
  { path: "/articles" },
  { path: "/podcasts" },
  // Add more routes as needed
];

export function shouldUseDarkMode(
  pathname: string,
  isLarge?: boolean
): boolean {
  return darkModeRoutes.some((route) => {
    // Skip mobile-only routes if we're on desktop
    if (route.mobileOnly && isLarge) {
      return false;
    }

    // For exact static matches
    if (!route.isDynamic && route.path === pathname) {
      return true;
    }

    // For dynamic routes
    if (route.isDynamic) {
      // Check if the current path starts with the base path
      // For example, /events/ will match /events/123, /events/my-event, etc.
      return pathname.startsWith(route.path);
    }

    return false;
  });
}
