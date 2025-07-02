export interface RockPerson {
  primaryAliasId: number;
  [key: string]: unknown;
}

export interface RockSession {
  [key: string]: unknown;
}

export interface UserProfile {
  [key: string]: unknown;
}

export interface TaggedItem {
  tagId: number;
  entityGuid: string;
}

export interface AttributeValue {
    value: string;
}

export interface ContentItem {
    contentChannelId: number;
    status: number;
    priority: number;
    attributeValues: {
        author?: AttributeValue;
        summary?: AttributeValue;
        url?: AttributeValue;
        [key: string]: AttributeValue | undefined;
    };
    attributes: attributeProps;
    content: string;
    startDateTime: string;
    title: string;
    guid: string;
}

export interface FormattedArticle {
    title: string;
    summary: string | undefined;
    url: string | undefined;
    coverImage: string[];
    publishDate: string;
    readTime: number;
    author: { name: string; image: string[]; } | null;
}

export interface Tag {
    name: string;
    guid: string;
}

export interface attributeProps {
  [key: string]: {
    fieldType: {
      name: string;
    };
  };
}

export interface attributeValuesProps {
  [key: string]: {
    value: string;
  };
}