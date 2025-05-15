import { ContentType, SectionType } from "../types";

/**
 * Maps content channel IDs to their corresponding section types
 */
const CONTENT_TYPE_MAP: Record<string, ContentType> = {
  "78": "EVENT",
  "63": "MESSAGE",
  "90": "REDIRECT_CARD",
  "43": "ARTICLES",
  "83": "DEVOTIONALS",
  "55": "PODCASTS",
  // Todo: Add the rest of the content types
} as const;

/**
 * Maps content channel IDs to their corresponding section types
 */
const SECTION_TYPE_MAP: Record<string, SectionType> = {
  "167": "EVENT_COLLECTION",
  "168": "RESOURCE_COLLECTION",
  "169": "CTA_COLLECTION",
  "170": "CONTENT_BLOCK",
} as const;

/**
 * Collection section types that can contain child items
 */
const COLLECTION_TYPES_MAP = [
  "EVENT_COLLECTION",
  "RESOURCE_COLLECTION",
  "CTA_COLLECTION",
] as const;

type CollectionTypes = (typeof COLLECTION_TYPES_MAP)[number];

/**
 * Gets the section type for a given content channel ID
 */
export const getSectionType = (
  contentChannelId: string
): SectionType | undefined => {
  return SECTION_TYPE_MAP[contentChannelId];
};

/**
 * Gets the content type for a given content channel ID
 */
export const getContentType = (
  contentChannelId: string
): ContentType | undefined => {
  return CONTENT_TYPE_MAP[contentChannelId];
};

/**
 * Checks if a content channel ID represents a collection type section
 */
export const isCollectionType = (contentChannelId: string): boolean => {
  const sectionType = getSectionType(contentChannelId);
  return COLLECTION_TYPES_MAP.includes(sectionType as CollectionTypes);
};

/**
 * Gets the pathname for a given content type and pathname
 */
export const getPathname = (
  contentType: ContentType,
  pathname: string
): string => {
  if (contentType && pathname && pathname !== "") {
    return `/${contentType.toLowerCase()}/${pathname}`;
  }
  return pathname;
};
