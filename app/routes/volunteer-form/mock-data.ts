import type {
  VolunteerFormPersonalInfo,
  VolunteerFormAvailability,
  VolunteerFormInterests,
  VolunteerResultCardProps,
} from "./types";

export const mockPersonalInfo: VolunteerFormPersonalInfo = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  phone: "555-123-4567",
  campus: "Palm Beach Gardens",
  dateOfBirth: "1990-01-01",
};

export const mockAvailability: VolunteerFormAvailability = {
  daysAvailable: ["Mon", "Wed", "Fri"],
  timesAvailable: ["Morning", "Afternoon"],
};

export const mockInterests: VolunteerFormInterests = {
  personality: 50,
  taskOriented: 50,
  strengths: ["Leading others", "Public speaking", "One-on-one conversations"],
  interests: [
    "Children & Youth",
    "Music & Worship",
    "Hospitality & Connections",
  ],
  comments: "I love helping out wherever needed!",
  backgroundCheck: true,
  ssn: "123456789",
};

export const mockResultCards: VolunteerResultCardProps[] = [
  {
    sticker: "super-hero",
    image: "https://picsum.photos/400/300?random=4",
    title: "Family Ministries",
    description:
      "The first smiling face someone sees at Christ Fellowship. The Connections team helps people take their first step in getting connected!",
    experience:
      "Working with elementary-aged children is a great match for this role",
    availability: "Sunday mornings aligns perfectly with our needs.",
    passion: "Share your passion for teaching and make a positive impact.",
    cta: "I'm interested",
    ctaType: "primary",
  },
  {
    sticker: "puzzle",
    image: "https://picsum.photos/400/300?random=7",
    title: "Creative & Worship",
    description:
      "The first smiling face someone sees at Christ Fellowship. The Connections team helps people take their first step in getting connected!",
    experience:
      "Working with elementary-aged children is a great match for this role",
    availability: "Sunday mornings aligns perfectly with our needs.",
    passion: "Share your passion for teaching and make a positive impact.",
    cta: "I'm interested",
    ctaType: "primary",
  },
  {
    sticker: "stair-stepper",
    image: "https://picsum.photos/400/300?random=3",
    title: "Missions",
    description:
      "The first smiling face someone sees at Christ Fellowship. The Connections team helps people take their first step in getting connected!",
    experience:
      "Working with elementary-aged children is a great match for this role",
    availability: "Sunday mornings aligns perfectly with our needs.",
    passion: "Share your passion for teaching and make a positive impact.",
    cta: "We got it!",
    ctaType: "secondary",
  },
];
