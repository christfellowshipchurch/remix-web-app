import { User_Auth_Status } from "~/providers/auth-provider";

export interface SmsAuthParams {
  pin: string;
  phoneNumber: string;
  userProfile: any[];
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
