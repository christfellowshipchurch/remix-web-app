export type attributeValuesProps = {
  [key: string]: {
    value: string;
    valueFormatted: string;
  };
};

export type attributeProps = {
  [key: string]: {
    key: string;
    name: string;
    fieldTypeId: number;
  };
};

export const ContentChannelIds = {
  articles: 43,
  default: 85,
  devotionals: 83,
  events: 78,
  locations: 88,
  messages: 63,
  studies: [79, 80],
  "so-good-sisterhood": 95,
  "keep-talking": 96,
};
