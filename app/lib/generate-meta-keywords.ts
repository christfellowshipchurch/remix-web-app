/**
 * Generates SEO keywords from page content. Use with createMeta() to produce
 * route-specific keywords while keeping default site keywords.
 */

import { DEFAULT_KEYWORDS } from './meta-utils';

/** Max number of content-derived terms to avoid an overly long keywords string. */
const MAX_CONTENT_TERMS = 12;

/** Minimum length for a word to be included (avoids "a", "of", etc.). */
const MIN_WORD_LENGTH = 2;

export type GenerateMetaKeywordsOptions = {
  /** Page/source title (e.g. article title, message title, event name). */
  title?: string;
  /** Category labels (e.g. primary/secondary categories). */
  categories?: string[];
  /** Author or speaker name. */
  authorOrSpeaker?: string;
  /** Series name (e.g. message series). */
  seriesTitle?: string;
  /** Optional type hint for extra terms (e.g. "sermon", "event", "podcast"). */
  type?: 'article' | 'message' | 'event' | 'podcast';
  /** Include default site keywords in the result. Default true. */
  includeDefaults?: boolean;
};

/**
 * Splits a string into normalized words (lowercase, no punctuation) and filters by length.
 */
function toWords(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= MIN_WORD_LENGTH);
}

/**
 * Deduplicates and trims an array, preserving order.
 */
function unique(arr: string[]): string[] {
  const seen = new Set<string>();
  return arr.filter((s) => {
    const key = s.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Builds a comma-separated keyword string from page data and optional default keywords.
 * Content-derived terms come first; default site keywords are appended when includeDefaults is true.
 */
export function generateMetaKeywords({
  title,
  categories = [],
  authorOrSpeaker,
  seriesTitle,
  type,
  includeDefaults = true,
}: GenerateMetaKeywordsOptions): string {
  const terms: string[] = [];

  if (title) {
    const titleWords = toWords(title).slice(0, 6);
    terms.push(...titleWords);
  }

  const categoryValues = categories
    .map((c) => c.trim())
    .filter((c) => c.length >= MIN_WORD_LENGTH);
  terms.push(...categoryValues);

  if (authorOrSpeaker?.trim()) {
    terms.push(...toWords(authorOrSpeaker).slice(0, 3));
  }

  if (seriesTitle?.trim()) {
    terms.push(...toWords(seriesTitle).slice(0, 3));
  }

  if (type === 'message') {
    terms.push('sermon', 'message', 'Christ Fellowship');
  } else if (type === 'event') {
    terms.push('event', 'Christ Fellowship');
  } else if (type === 'article') {
    terms.push('article', 'blog', 'Christ Fellowship');
  } else if (type === 'podcast') {
    terms.push('podcast', 'Christ Fellowship');
  }

  const contentTerms = unique(terms).slice(0, MAX_CONTENT_TERMS);
  const contentPart = contentTerms.join(', ');
  const defaultPart = includeDefaults ? DEFAULT_KEYWORDS : '';

  if (!contentPart) return defaultPart;
  if (!defaultPart) return contentPart;
  return `${contentPart}, ${defaultPart}`;
}
