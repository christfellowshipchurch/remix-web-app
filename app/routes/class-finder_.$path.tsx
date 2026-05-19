import type { ShouldRevalidateFunction } from 'react-router';

import { ClassSinglePage } from './class-finder/class-single/class-single-page';

export { action } from './class-finder/class-single/action';
export { loader } from './class-finder/class-single/loader';
export { meta } from './class-finder/class-single/meta';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // Class single is hybrid for now: loader seeds the initial page, then
  // Filter Sessions query-string changes are handled by client-side Algolia.
  if (
    currentUrl.pathname === nextUrl.pathname &&
    currentUrl.search !== nextUrl.search
  ) {
    return false;
  }

  return defaultShouldRevalidate;
};

export default ClassSinglePage;
