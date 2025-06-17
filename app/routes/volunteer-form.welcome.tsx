import React from "react";
import VolunteerFormWelcome from "./volunteer-form/partials/volunteer-form-welcome.partial";
import { useNavigate } from "react-router-dom";

export const VolunteerFormWelcomeRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <VolunteerFormWelcome
      onNext={() => navigate("/volunteer-form/personal-info")}
    />
  );
};

export default VolunteerFormWelcomeRoute;
