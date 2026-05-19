import type { ShouldRevalidateFunction } from 'react-router';

import { MessagesPage } from './all-messages/messages-page';

export { loader } from './all-messages/loader';
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

export default MessagesPage;
