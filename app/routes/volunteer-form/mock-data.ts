import type {
  VolunteerFormPersonalInfo,
  VolunteerFormAvailability,
  VolunteerFormPreferences,
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

export const mockPreferences: VolunteerFormPreferences = {
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
  ssn: "123-45-6789",
};
