import { icons } from "~/lib/icons";

export type EventSinglePageType = {
  title: string;
  subtitle: string;
  heroCtas: { title: string; url: string }[];
  quickPoints?: string[];
  coverImage: string;
  aboutTitle?: string;
  aboutContent?: string;
  keyInfoCards?: { title: string; description: string; icon: string }[];
  whatToExpect?: { title: string; description: string }[];
  moreInfo?: string;
  optionalBlurb?: { title: string; description: string }[];
  faqItems?: { question: string; answer: string }[];
  sessionScheduleCards?: SessionRegistrationCardType[];
};

export type SessionRegistrationCardType = {
  icon: keyof typeof icons;
  title: string;
  description: string;
  date: string;
  programTime: string;
  partyTime: string;
  additionalInfo?: string;
  url: string;
};
