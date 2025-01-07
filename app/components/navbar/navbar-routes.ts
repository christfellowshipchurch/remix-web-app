export const darkModeRoutes = [
  "/about",
  "/events",
  "/locations",
  // Add any routes that should have dark mode
];

// Helper function to check if current path should use dark mode
export function shouldUseDarkMode(pathname: string): boolean {
  return darkModeRoutes.some((route) => {
    // Exact match
    if (route === pathname) return true;
    // Check if current path starts with route path for nested routes
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
}
