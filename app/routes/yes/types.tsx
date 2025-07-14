export interface YesFormPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
}
export interface YesFormData {
  aboutYou: YesFormPersonalInfo;
}
