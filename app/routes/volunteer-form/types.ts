// Types for Volunteer Form multi-step process
export const INTERESTS = [
  "Children & Youth",
  "Music & Worship",
  "Technology & Production",
  "Hospitality & Connections",
  "Administrative Support",
  "Care & Support Ministries",
  "Creative Arts",
  "Outreach & Missions",
  "Facilities & Operations",
] as const;

export const STRENGTHS = [
  "Leading others",
  "Working behind the scenes",
  "Public speaking",
  "One-on-one conversations",
] as const;

export interface VolunteerFormWelcome {
  // No fields needed, just a welcome step
}

export const CAMPUS = [
  "Palm Beach Gardens",
  "Port St. Lucie",
  "Royal Palm Beach",
  "Boynton Beach",
  "Downtown West Palm Beach",
  "Jupiter",
  "Stuart",
  "Okeechobee",
  "Belle Glade",
  "Vero Beach",
  "Boca Raton",
  "Riviera Beach",
  "Trinity Church",
  "Westlake",
  "En Español Palm Beach Gardens",
  "En Español Royal Palm Beach",
];

export interface VolunteerFormPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  campus?: (typeof CAMPUS)[number];
  dateOfBirth?: string;
}

export interface VolunteerFormAvailability {
  daysAvailable: string[];
  timesAvailable: string[];
  frequency?: string;
  hoursPerWeek?: string;
}

export const DAYS_OF_WEEK = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
export const TIMES_OF_DAY = ["Morning", "Afternoon", "Evening"];
export const FREQUENCY_OPTIONS = [
  { value: "Weekly", label: "Weekly" },
  { value: "Bi-Weekly", label: "Bi-Weekly" },
  { value: "Monthly", label: "Monthly" },
];
export const HOURS_OPTIONS = [
  { value: "1-2", label: "1-2 hours" },
  { value: "2-4", label: "2-4 hours" },
  { value: "4+", label: "4+ hours" },
];

export interface VolunteerFormPreferences {
  personality: number;
  taskOriented: number;
  strengths: (typeof STRENGTHS)[number][];
  interests: (typeof INTERESTS)[number][];
  comments?: string;
  backgroundCheck: boolean;
  ssn: string;
}

export interface VolunteerFormConfirmation {
  // No fields needed, just a confirmation/results step
}

export interface VolunteerFormData {
  personalInfo: VolunteerFormPersonalInfo;
  availability: VolunteerFormAvailability;
  preferences: VolunteerFormPreferences;
}
