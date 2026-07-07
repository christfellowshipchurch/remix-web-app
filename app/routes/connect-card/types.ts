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

export type ConnectCardPrefill = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  campus?: string; // campus guid
};

export type ConnectCardPrefillStatus =
  | 'success'
  | 'invalid-id'
  | 'not-found'
  | 'error';

export type ConnectCardPrefillResponse =
  | { status: 'success'; prefill: ConnectCardPrefill }
  | { status: 'invalid-id' }
  | { status: 'not-found' }
  | { status: 'error'; message: string };
