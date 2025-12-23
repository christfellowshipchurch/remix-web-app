// Generic Rock ContentItem type
export interface RockContentChannelItem {
  id: string;
  contentChannelId: string;
  title: string;
  name: string;
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

export type AttributeMatrix = {
  id: number;
  guid: string;
  attributeMatrixTemplateId: number;
  attributeMatrixItems: AttributeMatrixItem[];
};

export type AttributeMatrixItem = {
  id: number;
  guid: string;
  attributeMatrixId: number;
  attributeMatrixItemTemplateId: number;
  attributeValues: attributeValuesProps;
  attributes: attributeProps;
};
