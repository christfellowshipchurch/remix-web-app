import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { VolunteerFormPreferences } from "./volunteer-form/types";
import { mockPreferences } from "./volunteer-form/mock-data";
import VolunteerFormPreferencesPartial from "./volunteer-form/partials/volunteer-form-preferences.partial";

export const VolunteerFormPreferencesRoute: React.FC = () => {
  const [data, setData] = useState<VolunteerFormPreferences>(mockPreferences);
  const navigate = useNavigate();
  return (
    <VolunteerFormPreferencesPartial
      data={data}
      onChange={(field, value) =>
        setData((prev) => ({ ...prev, [field]: value }))
      }
      onNext={() => navigate("/volunteer-form/confirmation")}
      onBack={() => navigate("/volunteer-form/availability")}
    />
  );
};

export default VolunteerFormPreferencesRoute;
