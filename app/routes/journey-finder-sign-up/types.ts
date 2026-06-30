export type JourneyFinderSignUpFormType = {
  FirstName: string;
  LastName: string;
  PrimaryPhoneNumber: string;
  EmailAddress: string;
  AtCF: string; // "1" | "2" | "3" | "4" | "5"
  Reason: string; // "1" | "2" | "3" | "4" | "5"
  hopetoget?: string;
  LaunchSource: 'app';
  Group: string;
};
