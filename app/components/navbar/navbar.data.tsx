import { MenuLink } from "./types";

export const mainNavLinks = [
  { title: "About", url: "/about" },
  { title: "Locations", url: "/locations" },
  { title: "Events", url: "/events" },
];

export const ministriesData: MenuLink = {
  title: "Get Involved",
  content: {
    mainContent: [
      {
        title: "NEXT GEN",
        items: [
          { title: "Kids", description: "Ages Birth - Grade 5", url: "#" },
          { title: "Students", description: "Grades 6 - 12", url: "#" },
          { title: "Young Adults", description: "Age College - 30s", url: "#" },
          {
            title: "Special Needs",
            description:
              "Support, resources, and community for children and adults with disabilities",
            url: "#",
          },
        ],
        link: "View all ministries",
      },
      {
        title: "ADULTS",
        items: [
          { title: "Men", description: "Find your band of brothers", url: "#" },
          {
            title: "Women",
            description: "For every girl from every generation",
            url: "#",
          },
          {
            title: "Marriage",
            description: "Lorem ipsum dolor sit amet",
            url: "#",
          },
          {
            title: "Care",
            description:
              "Find healing and freedom from hurts, habits, and hangups.",
            url: "#",
          },
        ],
      },
      {
        title: "GROUPS & CLASSES",
        items: [
          {
            title: "Group Finder",
            description: "Lorem ipsum dolor sit amet",
            url: "#",
          },
          {
            title: "Class Finder",
            description: "Lorem ipsum dolor sit amet",
            url: "#",
          },
          {
            title: "My Groups & Classes",
            description: "Lorem ipsum dolor sit amet",
            url: "#",
          },
          {
            title: "Volunteer",
            description: "Lorem ipsum dolor sit amet",
            url: "#",
          },
        ],
      },
    ],
    featureCards: [
      {
        title: "Take the Journey",
        subtitle: "new classes",
        callToAction: {
          title: "Sign up now",
          url: "/journey",
        },
        image: "https://picsum.photos/282/228",
        navMenu: "ministries",
      },
    ],
  },
};

export const watchReadListenData: MenuLink = {
  title: "Media",
  content: {
    mainContent: [
      {
        title: "WATCH",
        items: [
          { title: "Messages", url: "#" },
          { title: "Live Broadcast", url: "#" },
        ],
      },
      {
        title: "READ",
        items: [
          { title: "Articles", url: "#" },
          { title: "Devotionals", url: "#" },
        ],
      },
      {
        title: "LISTEN",
        items: [
          { title: "So Good Sisterhood Podcast", url: "#" },
          { title: "Crew Cast Podcast", url: "#" },
          { title: "Young & Adulting Podcast", url: "#" },
          { title: "MVMT Music", url: "#" },
        ],
      },
    ],
    featureCards: [
      {
        title: "LATEST MESSAGE",
        subtitle: "Don't waste your time",
        callToAction: {
          title: "Watch Now",
          url: "/",
        },
        image: "https://picsum.photos/282/228",
        navMenu: "media",
      },
      {
        title: "NEW ARTICLE",
        subtitle: "Master Your Money",
        callToAction: {
          title: "Read Now",
          url: "/",
        },
        image: "https://picsum.photos/282/228",
        navMenu: "media",
      },
    ],
  },
};

export const locationsData = {
  mainContent: [],
  additionalContent: [
    { title: "Palm Beach Gardens", url: "#" },
    { title: "Port St. Lucie", url: "#" },
    { title: "Royal Palm Beach", url: "#" },
    { title: "Boynton Beach", url: "#" },
    { title: "Downtown West Palm Beach", url: "#" },
    { title: "Jupiter", url: "#" },
    { title: "Stuart", url: "#" },
    { title: "Okeechobee", url: "#" },
    { title: "Belle Glade", url: "#" },
    { title: "Vero Beach", url: "#" },
    { title: "Boca Raton", url: "#" },
    { title: "Riviera Beach", url: "#" },
    { title: "Trinity Church", url: "#" },
    { title: "Westlake", url: "#" },
    { title: "En Español Palm Beach Gardens", url: "#" },
    { title: "En Español Royal Palm Beach", url: "#" },
  ],
};
