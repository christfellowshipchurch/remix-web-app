import { Author } from "../author/loader";

export type MessageType = {
  title: string;
  content: string;
  summary: string;
  image: string;
  coverImage: string;
  video: string;
  startDateTime: string;
  expireDateTime: string;
  series: string;
  url: string;
  speaker: {
    fullName: string;
    profilePhoto: string;
    guid: string;
  };
};
