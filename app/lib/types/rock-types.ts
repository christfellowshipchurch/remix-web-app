// Generic Rock ContentItem type
export type RockContentItem = {
  id: string;
  contentChannelId: string;
  title: string;
  content: string;
  attributeValues: attributeValuesProps;
  attributes: attributeProps;
  image: string;
  startDateTime: string;
  expireDateTime: string;
};

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
