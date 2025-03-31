// config/navbar-routes.ts
type RoutePattern = {
  path: string;
  isDynamic?: boolean;
};

// Define routes that should use dark mode
// Include both static and dynamic routes
export const darkModeRoutes: RoutePattern[] = [
  { path: "/about" },
  { path: "/events" },
  { path: "/locations" },
  { path: "/locations/", isDynamic: true }, // This will match /locations/[slug]
  { path: "/messages" },
  { path: "/messages/", isDynamic: true }, // This will match /messages/[slug]
  { path: "/articles" },
  // Add more routes as needed
];

export function shouldUseDarkMode(pathname: string): boolean {
  return darkModeRoutes.some((route) => {
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

// Example usage:
// shouldUseDarkMode('/events/summer-fest-2024') // returns true
// shouldUseDarkMode('/events') // returns true
// shouldUseDarkMode('/about') // returns true
// shouldUseDarkMode('/contact') // returns false
