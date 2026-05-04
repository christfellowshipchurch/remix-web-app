export type WhatWeOfferContentItem = {
  image?: string;
  label?: string;
  imageAspectRatio?: string;
  description1: string;
  description2?: string;
  url: string;
  /** Defaults to "Learn More" in the UI */
  ctaLabel?: string;
};

export type WhatWeOfferTab = {
  value: string;
  label: string;
  mobileLabel: string;
  /** Shown below the tab cards; updates with the active tab */
  footerSummary: string;
  content: WhatWeOfferContentItem[];
};

export const whatWeOfferData: WhatWeOfferTab[] = [
  {
    value: "family",
    label: "For My Family",
    mobileLabel: "Families",
    footerSummary:
      "Empowering your children and strengthening your family through engaging, faith-centered experiences.",
    content: [
      {
        image: "/assets/images/home/kids.png",
        description1: "Babies-Elementary",
        description2: "Every Sunday & Resources Throughout the Week",
        url: "/ministries/kids",
      },
      {
        image: "/assets/images/home/kids-u.png",
        imageAspectRatio: "144/190",
        description1: "Discipleship Programming for Preschool-Elementary",
        description2: "Midweek at Select Locations",
        url: "/christ-fellowship-kids-university",
      },
      {
        image: "/assets/images/home/students.png",
        description1: "Middle & High School Students",
        description2: "Every Wednesday",
        url: "/ministries/students",
      },
    ],
  },
  {
    value: "young-adults",
    label: "For Young Adults",
    mobileLabel: "Young Adults",
    footerSummary:
      "Vibrant community and resources designed for young adults and working professionals.",
    content: [
      {
        image: "/assets/images/home/ya.png",
        imageAspectRatio: "85/25",
        description1: `For Young Adults in
Their 20s & 30s`,
        description2: "Every Tuesday (hosted regionally & online)",
        url: "/ministries/young-adults",
      },
      {
        image: "/assets/images/home/college-nights.png",
        imageAspectRatio: "22/16",
        description1: "For College Students",
        description2:
          "Every Thursday (hosted at Trinity in Palm Beach Gardens)",
        url: "/college-nights",
      },
    ],
  },
  {
    value: "everyone",
    label: "For Everyone",
    mobileLabel: "Everyone",
    footerSummary:
      "Cultivate deep connections and meaningful growth with community support.",
    content: [
      {
        label: "Groups",
        description1:
          "Find a variety of small groups near you, doing what you like to do!",
        url: "/group-finder",
      },
      {
        label: "Classes",
        description1: "Grow through on-site studies on a variety of topics.",
        url: "/class-finder",
      },
      {
        label: "Freedom & Care",
        description1:
          "Resources to help you find freedom from hurts, habits, and hangups.",
        url: "/ministries/freedom-and-care",
      },
    ],
  },
];
