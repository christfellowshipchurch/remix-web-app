export type WhatWeOfferTab = {
  value: string;
  label: string;
  mobileLabel: string;
  content: {
    image?: string;
    label?: string;
    imageAspectRatio?: string;
    description1: string;
    description2?: string;
    url: string;
  }[];
};

export const whatWeOfferData: WhatWeOfferTab[] = [
  {
    value: "family",
    label: "For My Family",
    mobileLabel: "Families",
    content: [
      {
        image: "/assets/images/home/kids.png",
        description1: "Babies-Elementary",
        description2: "Every Sunday & Resources Throughout the Week",
        url: "/kids",
      },
      {
        image: "/assets/images/home/kids-u.png",
        imageAspectRatio: "144/190",
        description1: "Discipleship Programming for Preschool-Elementary",
        description2: "Midweek at Select Locations",
        url: "/kids-university",
      },
      {
        image: "/assets/images/home/students.png",
        description1: "Middle & High School Students",
        description2: "Every Wednesday",
        url: "/students",
      },
    ],
  },
  {
    value: "young-adults",
    label: "For Young Adults",
    mobileLabel: "Young Adults",
    content: [
      {
        image: "/assets/images/home/ya.png",
        imageAspectRatio: "85/25",
        description1: `For Young Adults in
Their 20s & 30s`,
        description2: "Every Tuesday (hosted regionally & online)",
        url: "/family",
      },
      {
        image: "/assets/images/home/college-nights.png",
        imageAspectRatio: "22/16",
        description1: "For College Students",
        description2:
          "Every Thursday (hosted at Trinity in Palm Beach Gardens)",
        url: "/family",
      },
    ],
  },
  {
    value: "everyone",
    label: "For Everyone",
    mobileLabel: "Everyone",
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
        url: "/freedom-and-care",
      },
    ],
  },
];
