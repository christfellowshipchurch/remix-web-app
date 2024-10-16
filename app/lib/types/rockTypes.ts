export type attributeProps = {
  [key: string]: {
    fieldTypeId: number;
    name: string;
  };
};

export type attributeValuesProps = {
  [key: string]: {
    value: string;
    valueFormatted: string;
  };
};
