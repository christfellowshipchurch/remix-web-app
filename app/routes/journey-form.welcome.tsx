import React from "react";
import JourneyFormWelcome from "./journey-form/partials/journey-form-welcome.partial";
import { useNavigate } from "react-router-dom";

export const JourneyFormWelcomeRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <JourneyFormWelcome
      onSubmit={() => navigate("/journey-form/personal-info")}
    />
  );
};

export default JourneyFormWelcomeRoute;
