export type JourneyFinderSignUpFormType = {
  FirstName: string;
  LastName: string;
  PrimaryPhoneNumber: string;
  EmailAddress: string;
  AtCF: string; // "1" | "2" | "3" | "4" | "5"
  hopetoget?: string;
  OriginalEntrySource: 'Web';
  LaunchSource: 'app';
  Group: string;
  PersonId: string;
};
