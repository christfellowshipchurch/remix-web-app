import type { ShouldRevalidateFunction } from 'react-router';

import { LocationSearchPage } from './location-search/location-search-page';

export { loader } from './location-search/loader';
export { meta } from './location-search/meta';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // Locations is hybrid: the loader seeds first paint, then zip/current-location
  // searches are handled by the client-side finder.
  if (
    currentUrl.pathname === nextUrl.pathname &&
    currentUrl.search !== nextUrl.search
  ) {
    return false;
  }

  return defaultShouldRevalidate;
};

export default LocationSearchPage;
