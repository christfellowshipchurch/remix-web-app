export type attributeValues = {
  [key: string]: {
    attributeId: number;
    value: string;
    valueFormatted: string;
  };
};

export type attributes = {
  [key: string]: {
    id: number;
    key: string;
    name: string;
    fieldTypeId: number;
  };
};

export type CampusData = {
  name: string;
  phoneNumber: string;
  url: string;
  serviceTimes: string;
  atributtes: attributes[];
  attributeValues: attributeValues[];
  // Add other properties as needed
};
