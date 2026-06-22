/** Query param appended to Rock embed URLs to opt into parent iframe resizing. */
export const ROCK_PARENT_RESIZE_QUERY_PARAM = 'ParentResize';

/**
 * Add this HTML block to Rock page 5886 (or any embedded Rock page) so the
 * parent site can resize the iframe while loading Rock directly (no proxy).
 *
 * Option A — inline script (recommended):
 * {% if PageParameter.ParentResize == '1' %}
 * <script>{% include '~~ paste contents of /public/rock-iframe-resize.js ~~' %}</script>
 * {% endif %}
 *
 * Option B — external script from this app:
 * {% if PageParameter.ParentResize == '1' %}
 * <script src="https://YOUR_APP_ORIGIN/rock-iframe-resize.js"></script>
 * {% endif %}
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
