import { Event } from "~/routes/events/all-events/loader";

export const mockEvents: Event[] = [
  {
    title: "Sunday Service",
    date: "March 24, 2024",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop",
    campus: "Main Campus",
    expireDateTime: "2024-03-24T12:00:00Z",
    startDate: "March 24, 2024",
    startDateTime: "2024-03-24T09:00:00Z",
    attributeValues: {
      summary: {
        value:
          "Join us for an inspiring Sunday service with worship and message.",
      },
      image: {
        value:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop",
      },
      url: {
        value: "sunday-service",
      },
    },
  },
  {
    title: "Youth Group Night",
    date: "March 27, 2024",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop",
    campus: "North Campus",
    expireDateTime: "2024-03-27T21:00:00Z",
    startDate: "March 27, 2024",
    startDateTime: "2024-03-27T18:00:00Z",
    attributeValues: {
      summary: {
        value: "A fun evening of games, worship, and Bible study for youth.",
      },
      image: {
        value:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop",
      },
      url: {
        value: "youth-group-night",
      },
    },
  },
  {
    title: "Community Outreach",
    date: "March 30, 2024",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop",
    campus: "All Campuses",
    expireDateTime: "2024-03-30T17:00:00Z",
    startDate: "March 30, 2024",
    startDateTime: "2024-03-30T09:00:00Z",
    attributeValues: {
      summary: {
        value:
          "Join us in serving our local community through various outreach programs.",
      },
      image: {
        value:
          "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop",
      },
      url: {
        value: "community-outreach",
      },
    },
  },
  {
    title: "Prayer Night",
    date: "April 3, 2024",
    image:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&auto=format&fit=crop",
    campus: "South Campus",
    expireDateTime: "2024-04-03T21:00:00Z",
    startDate: "April 3, 2024",
    startDateTime: "2024-04-03T19:00:00Z",
    attributeValues: {
      summary: {
        value:
          "A special evening dedicated to prayer, worship, and spiritual growth.",
      },
      image: {
        value:
          "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&auto=format&fit=crop",
      },
      url: {
        value: "prayer-night",
      },
    },
  },
  {
    title: "Family Fun Day",
    date: "April 6, 2024",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop",
    campus: "East Campus",
    expireDateTime: "2024-04-06T16:00:00Z",
    startDate: "April 6, 2024",
    startDateTime: "2024-04-06T10:00:00Z",
    attributeValues: {
      summary: {
        value:
          "A day of fun activities, games, and fellowship for the whole family.",
      },
      image: {
        value:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop",
      },
      url: {
        value: "family-fun-day",
      },
    },
  },
];
