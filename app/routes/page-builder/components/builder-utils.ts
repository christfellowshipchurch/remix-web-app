import { cn } from "~/lib/utils";
import { parseRockKeyValueList } from "~/lib/utils";
import { ContentBlockData, ContentType, SectionType } from "../types";

/**
 * Maps content channel IDs to their corresponding content types
 */
const CONTENT_TYPE_MAP: Record<string, ContentType> = {
  "186": "EVENT", // New Events Content Channel ID
  "63": "MESSAGES",
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
  "178": "FAQs",
  "177": "IMAGE_GALLERY",
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
  contentChannelId: string,
): SectionType | undefined => {
  return SECTION_TYPE_MAP[contentChannelId];
};

/**
 * Gets the content type for a given content channel ID
 */
export const getContentType = (
  contentChannelId: string,
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
  pathname: string,
): string => {
  if (contentType && pathname && pathname !== "") {
    return `/${contentType.toLowerCase()}/${pathname}`;
  }
  return pathname;
};

/**
 * Checks if a value is a GUID
 */
export const isGuid = (value: string): boolean => {
  const guidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(value);
};

/**
 * Gets the styles for a CTA buttons for CTA Card and CTA Fullscreen layouts
 */
export const getCtaStyles = (data: ContentBlockData, buttonLimit: number) => {
  const isDark = data.backgroundColor !== "WHITE";
  const isOcean = data.backgroundColor === "OCEAN";
  const buttonCount = parseRockKeyValueList(data.callsToAction ?? "").length;
  // If the button count is less than the button limit, then use the button count - 1
  // Otherwise, use the button limit - 1
  const isNotLastButton = (index: number) =>
    buttonCount < buttonLimit
      ? index !== buttonCount - 1
      : index !== buttonLimit - 1;

  const getButtonIntent = (index: number) => {
    if (isNotLastButton(index)) return "secondary";
    return isOcean ? "white" : "primary";
  };

  const getButtonClassName = (index: number) => {
    return cn(
      "w-full sm:w-auto hover:enabled:bg-white/10 transition-colors duration-300",
      {
        "text-soft-white border-soft-white": isDark && isNotLastButton(index),
        "hover:enabled:bg-white/10": isOcean && isNotLastButton(index),
        "hover:enabled:bg-ocean": !isDark,
        "hover:enabled:bg-white/80": isOcean && !isNotLastButton(index),
        "hover:enabled:bg-navy hover:enabled:text-white":
          !isDark && !isNotLastButton(index),
      },
    );
  };

  return {
    isDark,
    isOcean,
    getButtonIntent,
    getButtonClassName,
  };
};
