import DOMPurify from 'isomorphic-dompurify';

/**
 * Allowlist config for Rock CMS HTML content.
 *
 * Uses DOMPurify (via isomorphic-dompurify for SSR + browser). We avoid
 * `sanitize-html` because it pulls in postcss, which imports Node's `path`;
 * Vite client builds that externalize `path` then throw in the browser:
 * "Failed to resolve module specifier path".
 *
 * `isomorphic-dompurify` depends on jsdom; jsdom 28+ pulls `html-encoding-sniffer@6`,
 * which `require()`s ESM-only `@exodus/bytes` and crashes Vercel (ERR_REQUIRE_ESM).
 * Root `package.json` uses `pnpm.overrides` to pin `jsdom` to 26.1.0.
 *
 * iframe support is omitted — extend DOMPurify hooks if YouTube/Vimeo embeds
 * are required later.
 */
export function sanitizeCmsHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    // `target` is stripped by default unless allowlisted; HTMLRenderer needs it
    // to set rel="noopener noreferrer" for external links with target="_blank".
    ADD_ATTR: ['style', 'class', 'target'],
  });
}
