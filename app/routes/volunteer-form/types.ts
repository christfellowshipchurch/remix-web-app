// Types for Volunteer Form multi-step process

export interface VolunteerFormWelcome {
  // No fields needed, just a welcome step
}

export interface VolunteerFormPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface VolunteerFormAvailability {
  daysAvailable: string[];
  timesAvailable: string[];
}

export interface VolunteerFormPreferences {
  interests: string[];
  comments?: string;
}

export interface VolunteerFormConfirmation {
  // No fields needed, just a confirmation/results step
}

export interface VolunteerFormData {
  personalInfo: VolunteerFormPersonalInfo;
  availability: VolunteerFormAvailability;
  preferences: VolunteerFormPreferences;
}
