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

export type ConnectCardPrefillDebug = {
  detectedParam?: 'rckpid' | 'rckipid' | null;
  tokenPresent: boolean;
  tokenLength: number;
  tokenFingerprint?: string | null;
  validationPassed?: boolean;
  decodeAttempted?: boolean;
  personResolved?: boolean;
  personId?: string;
  hasFirstName?: boolean;
  hasLastName?: boolean;
  hasEmail?: boolean;
  hasPhone?: boolean;
  hasCampus?: boolean;
};

export type ConnectCardPrefillResponse =
  | {
      status: 'success';
      prefill: ConnectCardPrefill;
      debug?: ConnectCardPrefillDebug;
    }
  | { status: 'invalid-id'; debug?: ConnectCardPrefillDebug }
  | { status: 'not-found'; debug?: ConnectCardPrefillDebug }
  | { status: 'error'; message: string; debug?: ConnectCardPrefillDebug };
