export type ConnectFormType = {
  FirstName: string;
  LastName: string;
  Campus: string;
  Email: string;
  PhoneNumber: string;
};

export type ConnectCardLoaderReturnType = {
  campuses: string[];
  allThatApplies: { guid: string; value: string }[];
};
