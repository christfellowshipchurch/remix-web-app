import sanitizeHtml from "sanitize-html";

/**
 * Allowlist config for Rock CMS HTML content.
 *
 * Allows standard editorial HTML: headings, text formatting, links, lists,
 * blockquotes, and images. iframe support is intentionally omitted — Rock
 * content editors do not currently use embedded iframes. To add iframe support
 * (e.g. YouTube embeds), extend this config with an iframe allowlist and
 * restrict allowedIframeHostnames to trusted origins (youtube.com, vimeo.com).
 */
const CMS_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "img",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["class", "style"],
    img: ["src", "alt", "width", "height", "class"],
  },
};

/**
 * Sanitize CMS HTML from Rock RMS before rendering via dangerouslySetInnerHTML
 * or html-react-parser. Strips script tags, event handlers, and any tags/
 * attributes not in the allowlist.
 */
export function sanitizeCmsHtml(html: string): string {
  return sanitizeHtml(html, CMS_SANITIZE_OPTIONS);
}
