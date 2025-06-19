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
];

export const STRENGTHS = [
  "Leading others",
  "Working behind the scenes",
  "Public speaking",
  "One-on-one conversations",
];

export interface VolunteerFormWelcome {
  // No fields needed, just a welcome step
}

export interface VolunteerFormPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  campus?: string;
  dateOfBirth?: string;
}

export interface VolunteerFormAvailability {
  daysAvailable: string[];
  timesAvailable: string[];
}

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
