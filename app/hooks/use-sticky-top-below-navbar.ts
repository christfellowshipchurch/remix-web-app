import { useNavbarVisibility } from '~/providers/navbar-visibility-context';

/**
 * Sticky `top` offsets aligned with the main navbar mega-menu (`navbar.component.tsx`):
 * 82px nav row, +48px when the site banner is open → 130px total.
 */
export const STICKY_TOP_BELOW_NAVBAR = 'top-[82px]';
export const STICKY_TOP_BELOW_NAVBAR_AND_SITE_BANNER = 'top-[130px]';

/**
 * Tailwind classes for secondary sticky bars (finder filters, event tabs, back banner, etc.)
 * so they sit below the sticky navbar and account for the site banner when it is visible.
 */
export function useStickyTopBelowNavbarClass(): string {
  const { isNavbarVisible, isSiteBannerVisible } = useNavbarVisibility();
  if (!isNavbarVisible) return 'top-0';
  if (isSiteBannerVisible) return STICKY_TOP_BELOW_NAVBAR_AND_SITE_BANNER;
  return STICKY_TOP_BELOW_NAVBAR;
}
