/**
 * Scroll offset constants for anchor/hash scrolling when the sticky navbar is present.
 * Used so target sections are not cut off by the navbar.
 * Use a single offset large enough for when the navbar is visible to avoid coupling to navbar state.
 */

/** Actual rendered nav row height (logo `h-16` + `py-5` padding exceeds the `min-h-[82px]` floor). */
export const NAVBAR_HEIGHT = 104;

export const SCROLL_PADDING = 50;

/** Fixed offset for anchor scroll (navbar height + padding). Use this so scroll logic does not depend on navbar visibility and re-trigger. */
export const ANCHOR_SCROLL_OFFSET = NAVBAR_HEIGHT + SCROLL_PADDING;
