import type { ShouldRevalidateFunction } from 'react-router';

import { AllEventsPage } from './all-events/all-events-page';
import { loader } from './all-events/loader';

export { loader };
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

export default AllEventsPage;
