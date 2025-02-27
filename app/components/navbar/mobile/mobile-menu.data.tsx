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
    description: "Serve with others",
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
    to: "/giving",
  },
];

export const nextStepsItems: SubMenuItem[] = [
  {
    id: "new-believer",
    title: "New Believer",
    icon: "heart",
    to: "/next-steps/new-believer",
  },
  {
    id: "baptism",
    title: "Baptism",
    icon: "waves",
    to: "/next-steps/baptism",
  },
  {
    id: "take-a-class",
    title: "Take a Class",
    icon: "bookOpen",
    to: "/next-steps/classes",
  },
  {
    id: "join-a-group",
    title: "Join a Group",
    icon: "group",
    to: "/next-steps/groups",
  },
];

export const mediaItems: SubMenuItem[] = [
  {
    id: "messages",
    title: "Messages",
    icon: "video",
    to: "/media/messages",
  },
  {
    id: "articles",
    title: "Articles",
    icon: "bookContent",
    to: "/media/articles",
  },
  {
    id: "podcasts",
    title: "Podcasts",
    icon: "microphone",
    to: "/media/podcasts",
  },
  {
    id: "devotional",
    title: "Daily Devotional",
    icon: "bible",
    to: "/media/devotional",
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
    description: "Lorem ipsum",
    to: "/ministries/marriage",
  },
  {
    id: "care",
    title: "Care",
    description: "Healing & freedom",
    to: "/ministries/care",
  },
];
