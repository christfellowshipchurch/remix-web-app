/**
 * Represents a section type in the page builder
 */
export type SectionType =
  | "EVENT_COLLECTION"
  | "RESOURCE_COLLECTION"
  | "CTA_COLLECTION"
  | "CONTENT_BLOCK";

export type ContentType =
  | "EVENT"
  | "MESSAGE"
  | "SERMONS"
  | "ARTICLES"
  | "DEVOTIONALS"
  | "PODCASTS"
  | "REDIRECT_CARD"
  | "PAGE_BUILDER";

/**
 * Represents a call-to-action item with title and URL
 */
export type CallToAction = {
  title: string;
  url: string;
};

/**
 * Represents the structure of attribute values from Rock CMS
 */
export type RockAttributeValue = {
  value: string | number | boolean | null;
};

/**
 * Represents a collection card in the page builder
 */
export type CollectionItem = {
  id: string;
  contentChannelId: string;
  contentType: ContentType;
  name: string;
  summary: string;
  image: string;
  pathname: string;
  startDate?: string; // for Events, Sermons, Articles, Devotionals, Podcasts
  author?: string; // for Sermons, Articles, Devotionals, Podcasts
  location?: string; // for Events
  attributeValues?: Record<string, RockAttributeValue["value"]>; // TODO: Remove this when done testin
};

/**
 * Represents a child item in the page builder
 */
export type PageBuilderSection = {
  id: string;
  name: string;
  type: SectionType;
  content: string;
  attributeValues?: Record<string, RockAttributeValue["value"]>;
  collection?: CollectionItem[];
};

/**
 * Represents the complete page builder data structure
 */
export type PageBuilderLoader = {
  title: string;
  heroImage: string;
  callsToAction: CallToAction[];
  content: string;
  sections: PageBuilderSection[];
};
