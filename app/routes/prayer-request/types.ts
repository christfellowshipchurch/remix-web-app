export type PrayerRequestFormType = {
  FirstName: string;
  LastName: string;
  Email: string;
  MobilePhone: string;
  Campus: string; // campus guid
  Request: string;
  FollowUp?: string;
  LaunchSource: 'app';
  SendingFormName: 'CFDP App Prayer Request';
};

export type PrayerRequestLoaderReturnType = {
  campuses: { guid: string; name: string }[];
};
