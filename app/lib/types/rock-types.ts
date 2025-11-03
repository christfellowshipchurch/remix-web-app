// Generic Rock ContentItem type
export interface RockContentChannelItem {
  id: string;
  contentChannelId: string;
  title: string;
  content: string;
  attributeValues: attributeValuesProps;
  attributes: attributeProps;
  startDateTime: string;
  expireDateTime: string;
}

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
