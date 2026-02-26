import { MenuItem, SubMenuItem } from "./types";

export const welcomeMenuItems: MenuItem[] = [
  {
    id: "about",
    title: "About Us",
    description: "Our beliefs and history",
    icon: "church",
    to: "/about",
  },
  {
    id: "locations",
    title: "Plan a Visit",
    description: "Find a location near you",
    icon: "map",
    to: "/locations",
  },
  {
    id: "watch-live",
    title: "Watch Live",
    description: "Join us from anywhere",
    icon: "broadcast",
    to: "/watch",
  },
  {
    id: "latest-message",
    title: "Latest Message",
    description: "See what a service is like",
    icon: "circlePlayFilled",
    to: "/messages#latest",
  },
];

export const getInvolvedItems: MenuItem[] = [
  {
    id: "journey",
    title: "The Journey",
    description: "Lifes better together",
    icon: "arrowTopRight",
    to: "/journey",
  },
  {
    id: "volunteer",
    title: "Volunteer",
    description: "Local & Global Opportunities",
    icon: "handHeart",
    to: "/volunteer",
  },
  {
    id: "events",
    title: "Events",
    description: "Meaningful experiences",
    icon: "calendarAlt",
    to: "/events",
  },
  {
    id: "giving",
    title: "Giving",
    description: "Impact your world",
    icon: "heartHand",
    to: "/give",
  },
];

export const nextStepsItems: SubMenuItem[] = [
  {
    id: "new-believer",
    title: "New Believer",
    icon: "heart",
    to: "/next-steps",
  },
  {
    id: "baptism",
    title: "Baptism",
    icon: "waves",
    to: "/events/baptism",
  },
  {
    id: "take-a-class",
    title: "Take a Class",
    icon: "bookOpen",
    to: "/class-finder",
  },
  {
    id: "join-a-group",
    title: "Join a Group",
    icon: "group",
    to: "/group-finder",
  },
];

export const mediaItems: SubMenuItem[] = [
  {
    id: "messages",
    title: "Messages",
    icon: "video",
    to: "/messages",
  },
  {
    id: "articles",
    title: "Articles",
    icon: "bookContent",
    to: "/articles",
  },
  {
    id: "podcasts",
    title: "Podcasts",
    icon: "microphone",
    to: "/podcasts",
  },
  {
    id: "devotional",
    title: "Daily Devotional",
    icon: "bible",
    to: "/devotionals",
  },
];

export const ministriesItems: SubMenuItem[] = [
  {
    id: "kids",
    title: "Kids",
    description: "Birth - Grade 5",
    to: "/ministries/kids",
  },
  {
    id: "students",
    title: "Students",
    description: "Grades 6 - 12",
    to: "/ministries/students",
  },
  {
    id: "young-adults",
    title: "Young Adults",
    description: "College - 30s",
    to: "/ministries/young-adults",
  },
  {
    id: "special-needs",
    title: "Special Needs",
    description: "Children & Adults",
    to: "/ministries/special-needs",
  },
  {
    id: "men",
    title: "Men",
    description: "Men of all ages",
    to: "/ministries/men",
  },
  {
    id: "women",
    title: "Women",
    description: "Girls of all ages",
    to: "/ministries/women",
  },
  {
    id: "marriage",
    title: "Marriage",
    description: "Support & Resources",
    to: "/ministries/marriage",
  },
  {
    id: "care",
    title: "Care",
    description: "Healing & freedom",
    to: "/ministries/care",
  },
];

export const moreMenuItems: SubMenuItem[] = [
  {
    id: "about-us",
    title: "About Us",
    to: "/about",
  },
  {
    id: "request-prayer",
    title: "Request Prayer",
    to: "/request-prayer",
  },
  {
    id: "contact-us",
    title: "Contact Us",
    to: "mailto:hello@christfellowship.church",
  },
  {
    id: "resources",
    title: "Resources",
    to: "/resources",
  },
  {
    id: "our-beliefs-and-values",
    title: "Our Beliefs and Values",
    to: "/about#our-beliefs-and-values",
  },
  {
    id: "church-leadership",
    title: "Church Leadership",
    to: "/about#church-leadership",
  },
  {
    id: "southeastern",
    title: "Southeastern",
    to: "https://www.cfseu.com",
  },
];
