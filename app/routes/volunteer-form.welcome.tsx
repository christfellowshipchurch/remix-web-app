import React from "react";
import VolunteerFormWelcome from "./volunteer-form/partials/welcome-screen.partial";
import { useNavigate } from "react-router-dom";

export const VolunteerFormWelcomeRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <VolunteerFormWelcome
      onNext={() => navigate("/volunteer-form/about-you")}
    />
  );
};

export default VolunteerFormWelcomeRoute;
