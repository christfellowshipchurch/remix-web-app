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
};
