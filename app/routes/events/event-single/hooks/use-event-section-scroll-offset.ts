import { useCallback } from 'react';

import { useStickyTopBelowNavbarOffsetPx } from '~/hooks/use-sticky-top-below-navbar';

/** DOM id for the sticky About/FAQ/Register sub-nav rendered by `EventBanner`. */
export const EVENT_SECTION_NAV_ID = 'event-section-nav';

/** Breathing room between the sticky headers and the top of the target section. */
const SECTION_SCROLL_PADDING = 24;

/**
 * Returns a function that computes how far anchor scrolling (to About/FAQ/Register)
 * should stop short of a section's top, so it lands just below the site navbar and
 * the sticky event sub-nav — regardless of scroll direction, navbar visibility, or
 * whether the site banner is showing.
 *
 * The sub-nav's height is measured live via its DOM id rather than assumed, since it
 * always sits directly above these sections once scrolled to them (it doesn't need to
 * currently be "stuck" for its height to be correct).
 */
export function useEventSectionScrollOffset() {
  const navbarOffsetPx = useStickyTopBelowNavbarOffsetPx();

  return useCallback(() => {
    const subNavHeight =
      document.getElementById(EVENT_SECTION_NAV_ID)?.offsetHeight ?? 0;
    return navbarOffsetPx + subNavHeight + SECTION_SCROLL_PADDING;
  }, [navbarOffsetPx]);
}
