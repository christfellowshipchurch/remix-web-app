/**
 * Transform content type display names for search results
 * Removes "Page" suffix and standardizes naming conventions
 */
export const getDisplayContentType = (contentType: string): string => {
  if (contentType === "Page Builder" || contentType === "Redirect Card") {
    return "Resource";
  }
  // Remove " Page" suffix from content types
  return contentType.replace(/ Page$/, "");
};
