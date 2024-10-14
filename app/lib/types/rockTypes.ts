export type AttributeValue = {
  attributeId: number;
  value: string; // Sometimes a Guid
  valueFormatted: string;
};

export type Attribute = {
  id: number;
  key: string;
  name: string;
};

export type CampusData = {
  name: string;
  phoneNumber: string;
  serviceTimes: string;
  atributtes: Attribute[];
  attributeValues: AttributeValue[];
  // Add other properties as needed
};
