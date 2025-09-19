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
            url: "/group-finder",
          },
          {
            title: "Class Finder",
            description: "Lorem ipsum dolor sit amet",
            url: "/group-finder",
          },
          {
            title: "My Groups & Classes",
            description: "Lorem ipsum dolor sit amet",
            url: "/group-finder",
          },
          {
            title: "Volunteer",
            description: "Lorem ipsum dolor sit amet",
            url: "/volunteer",
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
          { title: "Messages", url: "/messages" },
          { title: "Live Broadcast", url: "/watch" },
        ],
      },
      {
        title: "READ",
        items: [
          { title: "Articles", url: "/articles" },
          { title: "Devotionals", url: "/devotionals" },
        ],
      },
      {
        title: "LISTEN",
        items: [
          {
            title: "So Good Sisterhood Podcast",
            url: "/podcasts/so-good-sisterhood",
          },
          { title: "Crew Cast Podcast", url: "/podcasts/crew" },
          {
            title: "Young + Adulting Podcast",
            url: "/podcasts/young-and-adulting",
          },
          { title: "MVMT Music", url: "/podcasts" },
        ],
      },
    ],
    // We will primarily pull featureCards from Rock, but will have hardcoding options if needed
    featureCards: [
      {
        title: "LATEST MESSAGE",
        subtitle: "Don't waste your time",
        callToAction: {
          title: "Watch Now",
          url: "/messages#latest",
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
    { title: "Palm Beach Gardens", url: "/location/palm-beach-gardens" },
    { title: "Port St. Lucie", url: "/location/port-st-lucie" },
    { title: "Royal Palm Beach", url: "/location/royal-palm-beach" },
    { title: "Boynton Beach", url: "/location/boynton-beach" },
    {
      title: "Downtown West Palm Beach",
      url: "/location/downtown-west-palm-beach",
    },
    { title: "Jupiter", url: "/location/jupiter" },
    { title: "Stuart", url: "/location/stuart" },
    { title: "Okeechobee", url: "/location/okeechobee" },
    { title: "Belle Glade", url: "/location/belle-glade" },
    { title: "Vero Beach", url: "/location/vero-beach" },
    { title: "Boca Raton", url: "/location/boca-raton" },
    { title: "Riviera Beach", url: "/location/riviera-beach" },
    { title: "Trinity Church", url: "/location/trinity-church" },
    { title: "Westlake", url: "/location/westlake" },
    {
      title: "En Español Palm Beach Gardens",
      url: "/location/en-espanol-palm-beach-gardens",
    },
    {
      title: "En Español Royal Palm Beach",
      url: "/location/en-espanol-royal-palm-beach",
    },
  ],
};
