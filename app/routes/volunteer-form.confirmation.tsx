import React from "react";
import { useNavigate } from "react-router-dom";
import {
  mockPersonalInfo,
  mockAvailability,
  mockPreferences,
} from "./volunteer-form/mock-data";
import VolunteerFormConfirmationPartial from "./volunteer-form/partials/volunteer-form-confirmation.partial";

export const VolunteerFormConfirmationRoute: React.FC = () => {
  const navigate = useNavigate();
  const data = {
    personalInfo: mockPersonalInfo,
    availability: mockAvailability,
    preferences: mockPreferences,
  };
  return (
    <VolunteerFormConfirmationPartial
      data={data}
      onFinish={() => navigate("/volunteer-form/welcome")}
    />
  );
};

export default VolunteerFormConfirmationRoute;
