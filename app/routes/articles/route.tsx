import type { ShouldRevalidateFunction } from 'react-router';

import { AllArticlesPage } from './all-articles/all-articles-page';

export { loader } from './all-articles/loader';
export { meta } from './meta';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  if (
    currentUrl.pathname === nextUrl.pathname &&
    currentUrl.search !== nextUrl.search
  ) {
    return false;
  }

  return defaultShouldRevalidate;
};

export default AllArticlesPage;
