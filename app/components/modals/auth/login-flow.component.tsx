/**
 * This component is a flow for the user to login or sign up and determines which step/screen to render based on the user's input.
 * It interacts with the AuthProvider to handle user registration, login, and pin verification.
 */
import React, { useEffect, useState } from "react";
import { RegistrationTypes, useAuth } from "~/providers/auth-provider";
import AccountCreation from "./account-creation.component";
import CreatePassword from "./create-password.component";
import InitialSignUp from "./initial-signup.component";

import PasswordScreen from "./password-screen.component";
import PinScreen from "./pin-screen.component";
import Login from "./login.component";

enum LoginStep {
  INITIAL_SIGNUP,
  ACCOUNT_CREATION,
  CREATE_PASSWORD,
  LOGIN,
  PASSWORD_SCREEN,
  PIN_SCREEN,
}

export interface NewUser {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  email?: string;
  phone?: string;
}

interface LoginFlowProps {
  setOpenModal: (open: boolean) => void;
}

const determineIdentityType = (
  identity: string
): "email" | "phone" | "unknown" => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  if (emailRegex.test(identity)) return "email";
  if (phoneRegex.test(identity)) return "phone";
  return "unknown";
};

const LoginFlow: React.FC<LoginFlowProps> = ({ setOpenModal }) => {
  const [step, setStep] = useState<LoginStep>(LoginStep.INITIAL_SIGNUP);
  const [identity, setIdentity] = useState("");
  const [identityType, setIdentityType] = useState<
    "email" | "phone" | "unknown"
  >("unknown");
  const [newUser, setNewUser] = useState<NewUser | null>(null);
  const { loginWithEmail, registerUser, requestSmsPin, loginWithSms } =
    useAuth();

  useEffect(() => {
    setIdentityType(determineIdentityType(identity));
  }, [identity]);

  const handleInitialSignUp = async (identityInput: string) => {
    if (identityInput && identityInput !== "") {
      setIdentity(identityInput);
      setStep(LoginStep.ACCOUNT_CREATION);
    } else {
      setStep(LoginStep.LOGIN);
    }
  };

  const handleAccountCreation = async (userData: NewUser) => {
    if (userData) {
      setNewUser(userData);
      switch (true) {
        case identityType === "email":
          setStep(LoginStep.CREATE_PASSWORD);
          break;
        // If using a phone number, we'll request a pin and register the user with it
        case identityType === "phone":
          await requestSmsPin(identity);
          setStep(LoginStep.PIN_SCREEN);
          break;
        default:
          console.error(
            "Error: Invalid identity input inside handleAccountCreation()"
          );
          break;
      }
    }
  };

  const handleCreatePassword = async (password: string) => {
    if (password) {
      const userInputDataEmail = {
        phoneNumber: newUser?.phone || null,
        email: identity as string,
        password,
        userProfile: [
          { field: "FirstName", value: newUser?.firstName || "" },
          { field: "LastName", value: newUser?.lastName || "" },
          { field: "BirthDate", value: newUser?.birthDate || "" },
          { field: "Gender", value: newUser?.gender || "" },
        ],
      };
      await registerUser(userInputDataEmail, RegistrationTypes.EMAIL);
      setOpenModal(false);
    }
  };

  const handleLogin = async (identityInput: string) => {
    if (identityInput && identityInput !== "") {
      setIdentity(identityInput);

      switch (true) {
        case identityInput === "sign-up":
          setStep(LoginStep.INITIAL_SIGNUP);
          break;
        case determineIdentityType(identityInput) === "email":
          setStep(LoginStep.PASSWORD_SCREEN);
          break;
        case determineIdentityType(identityInput) === "phone":
          await requestSmsPin(identityInput);
          setStep(LoginStep.PIN_SCREEN);
          break;
        default:
          console.error("Error: Invalid identity input inside handleLogin()");
          break;
      }
    }

    return;
  };

  const handlePasswordLogin = async (password: string) => {
    await loginWithEmail(identity, password);
    setOpenModal(false);
  };

  const handlePinLoginOrRegistration = async (pin: string) => {
    if (newUser) {
      const userInputDataSms = {
        phoneNumber: identity,
        email: newUser.email || null,
        pin,
        userProfile: [
          { field: "FirstName", value: newUser?.firstName || "" },
          { field: "LastName", value: newUser?.lastName || "" },
          { field: "BirthDate", value: newUser?.birthDate || "" },
          { field: "Gender", value: newUser?.gender || "" },
        ],
      };
      await registerUser(userInputDataSms, RegistrationTypes.SMS);
    } else {
      await loginWithSms(identity, pin);
    }
    setOpenModal(false);
  };

  const renderStep = () => {
    switch (step) {
      case LoginStep.INITIAL_SIGNUP:
        return <InitialSignUp onSubmit={handleInitialSignUp} />;
      case LoginStep.ACCOUNT_CREATION:
        return (
          <AccountCreation
            identityType={identityType}
            onSubmit={handleAccountCreation}
          />
        );
      case LoginStep.CREATE_PASSWORD:
        return <CreatePassword onSubmit={handleCreatePassword} />;
      case LoginStep.LOGIN:
        return <Login onSubmit={handleLogin} />;
      case LoginStep.PASSWORD_SCREEN:
        return <PasswordScreen onSubmit={handlePasswordLogin} />;
      case LoginStep.PIN_SCREEN:
        return (
          <PinScreen
            onSubmit={handlePinLoginOrRegistration}
            phoneNumber={identity}
            onResend={async () => {
              await requestSmsPin(identity);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 min-w-72 max-w-md sm:min-w-96 md:w-96">
      {renderStep()}
    </div>
  );
};

export default LoginFlow;
