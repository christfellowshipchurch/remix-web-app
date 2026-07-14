export type DreamTeamKickoffFormType = {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  EmailAddress: string;
  Campus: string;
  Birthdate: string;
  CompletedJourney: string;
  FilledOutApplication: string;
  ActiveOnDreamTeam: string;
  LaunchSource: 'app';
  Group?: string;
};

export type DreamTeamKickoffLoaderReturnType = {
  campuses: { guid: string; name: string }[];
};
