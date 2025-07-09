// Types for Volunteer Form multi-step process

export interface VolunteerFormWelcome {
  // No fields needed, just a welcome step
}

export interface VolunteerFormPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface VolunteerFormConfirmation {
  // No fields needed, just a confirmation/results step
}

export interface VolunteerFormData {
  personalInfo: VolunteerFormPersonalInfo;
}
