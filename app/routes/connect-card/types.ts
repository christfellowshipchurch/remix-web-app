export type ConnectFormType = {
  FirstName: string;
  LastName: string;
  Campus: string; // campus guid
  Email: string;
  PhoneNumber: string;
  Decision?: string;
  AllThatApplies?: string;
  Other?: string;
};

export type ConnectCardLoaderReturnType = {
  campuses: { guid: string; name: string }[];
  allThatApplies: { guid: string; value: string }[];
};
