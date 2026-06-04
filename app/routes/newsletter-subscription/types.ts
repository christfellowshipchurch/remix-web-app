export type NewsletterSubscriptionFormType = {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  EmailAddress: string;
  Campus: string; // campus guid
  LaunchSource: 'app';
};

export type NewsletterSubscriptionLoaderReturnType = {
  campuses: { guid: string; name: string }[];
};
