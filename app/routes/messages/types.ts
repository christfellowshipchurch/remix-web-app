export type MessageType = {
  id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  coverImage: string;
  video: string;
  startDateTime: string;
  expireDateTime: string;
  seriesId: string;
  seriesTitle: string;
  url: string;
  primaryCategories: { value: string }[];
  secondaryCategories: { value: string }[];
  speaker: {
    fullName: string;
    profilePhoto: string;
    guid: string;
  };
  additionalResources: {
    title: string;
    url: string;
  }[];
};
