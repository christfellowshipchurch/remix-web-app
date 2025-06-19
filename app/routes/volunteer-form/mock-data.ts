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
  daysAvailable: ["Monday", "Wednesday", "Friday"],
  timesAvailable: ["Morning", "Afternoon"],
};

export const mockPreferences: VolunteerFormPreferences = {
  personality: 50,
  taskOriented: 50,
  strengths: ["Leadership", "Communication", "Teamwork"],
  interests: ["Children", "Music", "Hospitality"],
  comments: "I love helping out wherever needed!",
  backgroundCheck: true,
  ssn: "123-45-6789",
};
