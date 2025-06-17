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
};

export const mockAvailability: VolunteerFormAvailability = {
  daysAvailable: ["Monday", "Wednesday", "Friday"],
  timesAvailable: ["Morning", "Afternoon"],
};

export const mockPreferences: VolunteerFormPreferences = {
  interests: ["Children", "Music", "Hospitality"],
  comments: "I love helping out wherever needed!",
};
