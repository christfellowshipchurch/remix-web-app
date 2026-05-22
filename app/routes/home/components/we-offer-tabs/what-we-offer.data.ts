import { getImageUrl } from '~/lib/utils';

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
        image: getImageUrl('3176684'),
        tag: 'Every Sunday',
        name: 'Sunday Kids',
        description:
          'Welcome guests, serve coffee, or help behind the scenes. Be part of making church feel easy to walk into.',
        url: '/ministries/kids',
      },
      {
        image: getImageUrl('7bcd69be-8395-45a6-9221-a547461bdcad', {
          useGuid: true,
        }),
        tag: 'Mid Week',
        name: 'Kids University',
        description:
          'Welcome guests, serve coffee, or help behind the scenes. Be part of making church feel easy to walk into.',
        url: '/christ-fellowship-kids-university',
      },
      {
        image: getImageUrl('c9c1aeed-43d0-4e20-9a28-9a96787c02a0', {
          useGuid: true,
        }),
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
        image: getImageUrl('3176687'),
        tag: 'Every Tuesday',
        name: 'Young Adults',
        description:
          'For Young Adults in Their 20s & 30s — hosted regionally & online.',
        url: '/ministries/young-adults',
      },
      {
        image: getImageUrl('492a58fc-8af1-42b1-9774-3c8804c9fb25', {
          useGuid: true,
        }),
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
        image: getImageUrl('3176685'),
        tag: 'Groups',
        name: 'Find Your Group',
        description:
          'Find a variety of small groups near you, doing what you like to do!',
        url: '/group-finder',
      },
      {
        image: getImageUrl('3176686'),
        tag: 'Classes',
        name: 'Grow Through Classes',
        description: 'Grow through on-site studies on a variety of topics.',
        url: '/class-finder',
      },
      {
        image: getImageUrl('3176688'),
        tag: 'Freedom & Care',
        name: 'Freedom & Care',
        description:
          'Resources to help you find freedom from hurts, habits, and hangups.',
        url: '/ministries/freedom-and-care',
      },
    ],
  },
];
