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
        description1: "Sunday programs for x-x",
        description2: "Parenting guides & resources",
        url: "/kids",
      },
      {
        image: "/assets/images/home/kids-u.png",
        imageAspectRatio: "144/190",
        description1: "Weekday programing for for elementary kids",
        description2:
          "Discipleship programming designed with your child in mind.",
        url: "/kids-university",
      },
      {
        image: "/assets/images/home/students.png",
        description1:
          "Middle and high school students, weekly worship services, small groups, and biblical teachings.",
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
        description1: "Young Adult programing",
        url: "/family",
      },
      {
        image: "/assets/images/home/college-nights.png",
        imageAspectRatio: "22/16",
        description1: "College Nights",
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
        description1: "Weekday programing for for elementary kids",
        url: "/groups",
      },
      {
        label: "Classes",
        description1: "Weekday programing for for elementary kids",
        url: "/groups",
      },
      {
        label: "Freedom & Care",
        description1: "Weekday programing for for elementary kids",
        url: "/freedom-and-care",
      },
    ],
  },
];
