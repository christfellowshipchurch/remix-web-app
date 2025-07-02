import { User_Auth_Status } from "~/providers/auth-provider";

export interface UserProfile {
  field: string;
  value: string;
}

export interface SmsAuthParams {
  pin: string;
  phoneNumber: string;
  userProfile: UserProfile[];
  email?: string | null;
}

export type SmsPinResult = {
  success?: boolean;
  userAuthStatus?: User_Auth_Status;
};

// Just using the main attributes we would use from Rock
export type RockUserLogin = {
  userName: string;
  isConfirmed: boolean;
  personId: number;
  id: number;
  guid: string;
};
