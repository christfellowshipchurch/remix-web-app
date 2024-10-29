import { redirect, useFetcher } from "@remix-run/react";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AUTH_TOKEN_KEY = "auth-token";

export enum User_Auth_Status {
  ExistingAppUser = "EXISTING_APP_USER",
  NewAppUser = "NEW_APP_USER",
  None = "NONE",
}

export type User = {
  id: string;
  profile: {
    id: string;
    fullName: string;
    email: string;
    guid: string;
    gender: string;
    birthDate: string;
  };
};

export type UserProfileField = {
  field: string | null;
  value: string | null;
};

export type UserInputData = {
  phoneNumber?: string | null;
  email?: string | null;
  pin: string | null;
  userProfile: UserProfileField[];
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identity: string, password: string) => Promise<void>;
  logout: () => void;
  checkUserExists: (identity: string) => Promise<boolean>;
  registerUser: (
    userInputData: UserInputData,
    registrationType: string
  ) => Promise<void>;
  requestSmsPin: (phoneNumber: string) => Promise<void>;
  loginWithSms: (phoneNumber: string, pin: string) => Promise<void>;
}

const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  throw error;
};

const ROUTES = {
  LOGIN: "/protected",
  LOGOUT: "/",
} as const;

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const fetcher = useFetcher();
  const [user, setUser] = useState<User | null>(null);
  const [headerToken, setHeaderToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const encryptedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        if (encryptedToken) {
          const response = await fetch("/api/auth/decrypt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ encryptedToken }),
          });

          const { decryptedToken } = (await response.json()) as {
            decryptedToken: string;
          };
          setHeaderToken(decryptedToken);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        handleError(error, "Error loading token:");
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (headerToken) {
        try {
          // await checkCurrentUser();
        } catch (error) {
          handleError(error, "Error loading user:");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchCurrentUser();
  }, [headerToken]);

  const login = async (identity: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("identity", identity);
      formData.append("password", password);

      const response = await fetch("/authenticate", {
        method: "POST",
        body: formData,
      });

      const { encryptedToken } = await response.json();

      localStorage.setItem(AUTH_TOKEN_KEY, encryptedToken);

      redirect(ROUTES.LOGIN);
    } catch (error) {
      handleError(error, "Login error:");
    }
  };

  const logout = () => {
    redirect(ROUTES.LOGOUT);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const checkUserExists = async (identity: string): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("identity", identity);

      const response = await fetch("/userExists", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      return result.userExists;
    } catch (error) {
      handleError(error, "Error checking user existence:");
      return false;
    }
  };

  const registerUser = async (
    userInputData: UserInputData,
    registrationType: string
  ) => {
    try {
      const registerMutation: any = async () => {}; // placeholder function
      const { data } = await registerMutation();
      if (data) {
        const registeredUserData =
          registrationType === "email"
            ? data.registerPerson
            : data.registerWithSms;
        const { token, user } = registeredUserData;
        // await storeEncryptedToken(token);
        setUser(user);
        redirect(ROUTES.LOGIN);
      }
    } catch (error) {
      handleError(error, "Registration error:");
    }
  };

  const requestSmsPin = async (phoneNumber: string) => {
    try {
      const formData = new FormData();
      formData.append("phoneNumber", phoneNumber);

      //trigger SMS pin request action
      await fetch("/requestSmsPinLogin", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      handleError(error, "SMS PIN request error:");
    }
  };

  const loginWithSms = async (phoneNumber: string, pin: string) => {
    try {
      const formData = new FormData();
      formData.append("phoneNumber", phoneNumber);
      formData.append("pin", pin);

      // trigger SMS authentication action
      const response = await fetch("/authenticateSms", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error occurred");
      }

      const { encryptedToken } = await response.json();

      localStorage.setItem(AUTH_TOKEN_KEY, encryptedToken);

      redirect(ROUTES.LOGIN);
    } catch (error) {
      console.error("SMS login error:", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    checkUserExists,
    registerUser,
    requestSmsPin,
    loginWithSms,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
