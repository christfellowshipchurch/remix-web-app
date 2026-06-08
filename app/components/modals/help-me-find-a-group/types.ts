export type CampusOption = {
  guid: string;
  name: string;
};

export type HubOption = {
  guid: string;
  value: string;
};

export type HelpMeFindAGroupLoaderReturnType = {
  campuses: CampusOption[];
  hubs: HubOption[];
};

export type HelpMeFindAGroupFormType = {
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  PhoneNumber: string;
  Campus: string;
  Type: string;
  Hub: string;
  Comments?: string;
  LaunchSource: 'app';
  SendingFormName: 'CFDP App Help Me Find a Group';
};
