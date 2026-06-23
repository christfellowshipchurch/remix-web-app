/** Query param appended to Rock embed URLs to opt into parent iframe resizing. */
export const ROCK_PARENT_RESIZE_QUERY_PARAM = 'ParentResize';

/**
 * Rock iframe auto-height for direct embeds (rock-page uses useAdvancedProxy=false).
 *
 * ## Where to add it in Rock
 *
 * **Page Properties → Header Content** (raw HTML, no Lava) — paste a script tag or
 * inline script. The `if (window.self === window.top) return` guard ensures it only
 * runs when framed; no `{% if PageParameter.ParentResize %}` needed.
 *
 * **Lava HTML blocks** — same script; optional ParentResize guard if you prefer.
 *
 * Add to every page/template in a multi-step workflow. Step 2 often uses a different
 * Rock page; header content on page 5886 alone is not enough.
 *
 * ## Recommended (stays in sync with app fixes)
 * <script src="https://YOUR_APP_ORIGIN/rock-iframe-resize.js"></script>
 *
 * ## Inline fallback (Page Properties → Header Content)
 * Paste the contents of /public/rock-iframe-resize.js inside <script>...</script>.
 *
 * Parent scroll-to-top on form step changes is handled by the React app (rock-page
 * onLoad), not this script.
 *
 * Parent navigation from inside the iframe (when target="_top" is blocked):
 * <a href="#" data-rock-parent-navigate="https://christfellowship.church/volunteer">
 *   Back to volunteer page
 * </a>
 */
export function getRockEmbedOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}
