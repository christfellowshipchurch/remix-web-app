export type ShareMySkillsFormType = {
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  Campus1: string;
  PhoneNumber: string;
  SkillsInterests: string;
  Skills: string;
  LaunchSource: 'app';
};

export type ShareMySkillsLoaderReturnType = {
  campuses: { guid: string; name: string }[];
};
