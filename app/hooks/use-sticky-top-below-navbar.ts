import { useNavbarVisibility } from "~/providers/navbar-visibility-context";

/**
 * Sticky `top` offsets aligned with the main navbar mega-menu (`navbar.component.tsx`):
 * 82px nav row, +48px when the site banner is open → 130px total.
 */
/** Main nav row height used for secondary bars (`navbar.component.tsx` min-h). */
export const NAVBAR_ROW_OFFSET_PX = 82;
/** Nav row + site banner when the banner is visible. */
export const NAVBAR_AND_SITE_BANNER_OFFSET_PX = 130;

export const STICKY_TOP_BELOW_NAVBAR = "top-[82px]";
export const STICKY_TOP_BELOW_NAVBAR_AND_SITE_BANNER = "top-[130px]";

/**
 * Tailwind classes for secondary sticky bars (finder filters, event tabs, back banner, etc.)
 * so they sit below the sticky navbar and account for the site banner when it is visible.
 */
export function useStickyTopBelowNavbarClass(): string {
  const { isNavbarVisible, isSiteBannerVisible } = useNavbarVisibility();
  if (!isNavbarVisible) return "top-0";
  if (isSiteBannerVisible) return STICKY_TOP_BELOW_NAVBAR_AND_SITE_BANNER;
  return STICKY_TOP_BELOW_NAVBAR;
}

/**
 * Same thresholds as `useStickyTopBelowNavbarClass`, in pixels, for scroll / layout math.
 */
export function useStickyTopBelowNavbarOffsetPx(): number {
  const { isNavbarVisible, isSiteBannerVisible } = useNavbarVisibility();
  if (!isNavbarVisible) return 0;
  if (isSiteBannerVisible) return NAVBAR_AND_SITE_BANNER_OFFSET_PX;
  return NAVBAR_ROW_OFFSET_PX;
}
