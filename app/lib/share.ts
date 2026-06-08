/**
 * Utilities for building social share URLs.
 *
 * Usage:
 *   import { buildSocialShareUrls } from '~/lib/share';
 *   const urls = buildSocialShareUrls('https://christfellowship.church/articles/my-article', 'My Article Title');
 *   // urls.twitter, urls.facebook, urls.linkedIn
 */

export interface SocialShareUrls {
  twitter: string;
  facebook: string;
  linkedIn: string;
}

/**
 * Build social share URLs for a given page URL and optional title.
 *
 * @param pageUrl - The full canonical URL of the page to share (e.g. "https://christfellowship.church/articles/my-post")
 * @param title   - Optional page/article title. Used as pre-filled text on Twitter/X and passed
 *                  directly to LinkedIn (bypassing OG tag scraping).
 *
 * Notes:
 * - Twitter/X: supports pre-filled text via `text=` param.
 * - LinkedIn:  uses the `shareArticle` endpoint which accepts `title` and `summary` directly,
 *              so the share dialog shows content without needing OG tags scraped.
 * - Facebook:  `sharer.php` does not support pre-filled text (deprecated by Meta).
 *              The dialog preview is populated from the page's OG meta tags.
 */
export function buildSocialShareUrls(
  pageUrl: string,
  title?: string,
): SocialShareUrls {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title ?? '');

  return {
    // Twitter/X: pre-fills the tweet with the title and a link
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,

    // Facebook: opens the share dialog — preview content comes from the page's OG meta tags
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,

    // LinkedIn: shareArticle endpoint passes title directly so the dialog
    // is populated without relying on OG tag scraping
    linkedIn: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };
}
