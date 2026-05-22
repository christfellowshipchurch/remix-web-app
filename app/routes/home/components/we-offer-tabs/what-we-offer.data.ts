export type WhatWeOfferCardItem = {
  image: string;
  tag: string;
  name: string;
  description: string;
  url: string;
};

export type WhatWeOfferTab = {
  value: string;
  label: string;
  mobileLabel: string;
  /** Shown below the tab cards; updates with the active tab */
  footerSummary: string;
  content: WhatWeOfferCardItem[];
};

export const whatWeOfferData: WhatWeOfferTab[] = [
  {
    value: 'family',
    label: 'For My Family',
    mobileLabel: 'Families',
    footerSummary:
      'Empowering your children and strengthening your family through engaging, faith-centered experiences.',
    content: [
      {
        image: '/assets/images/home/kids.png',
        tag: 'Every Sunday',
        name: 'Sunday Kids',
        description:
          'Welcome guests, serve coffee, or help behind the scenes. Be part of making church feel easy to walk into.',
        url: '/ministries/kids',
      },
      {
        image: '/assets/images/home/kids-u.png',
        tag: 'Mid Week',
        name: 'Kids University',
        description:
          'Welcome guests, serve coffee, or help behind the scenes. Be part of making church feel easy to walk into.',
        url: '/christ-fellowship-kids-university',
      },
      {
        image: '/assets/images/home/students.png',
        tag: 'Wednesdays',
        name: 'Students',
        description:
          'Welcome guests, serve coffee, or help behind the scenes. Be part of making church feel easy to walk into.',
        url: '/ministries/students',
      },
    ],
  },
  {
    value: 'young-adults',
    label: 'For Young Adults',
    mobileLabel: 'Young Adults',
    footerSummary:
      'Vibrant community and resources designed for young adults and working professionals.',
    content: [
      {
        image: '/assets/images/home/ya.png',
        tag: 'Every Tuesday',
        name: 'Young Adults',
        description: "For Young Adults in Their 20s & 30s — hosted regionally & online.",
        url: '/ministries/young-adults',
      },
      {
        image: '/assets/images/home/college-nights.png',
        tag: 'Every Thursday',
        name: 'College Nights',
        description:
          'For College Students, hosted at Trinity in Palm Beach Gardens.',
        url: '/college-nights',
      },
    ],
  },
  {
    value: 'everyone',
    label: 'For Everyone',
    mobileLabel: 'Everyone',
    footerSummary:
      'Cultivate deep connections and meaningful growth with community support.',
    content: [
      {
        image: 'https://placehold.co/405x192',
        tag: 'Groups',
        name: 'Find Your Group',
        description:
          'Find a variety of small groups near you, doing what you like to do!',
        url: '/group-finder',
      },
      {
        image: 'https://placehold.co/405x192',
        tag: 'Classes',
        name: 'Grow Through Classes',
        description: 'Grow through on-site studies on a variety of topics.',
        url: '/class-finder',
      },
      {
        image: 'https://placehold.co/405x192',
        tag: 'Freedom & Care',
        name: 'Freedom & Care',
        description:
          'Resources to help you find freedom from hurts, habits, and hangups.',
        url: '/ministries/freedom-and-care',
      },
    ],
  },
];
