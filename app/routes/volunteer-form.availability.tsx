import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { VolunteerFormAvailability } from "./volunteer-form/types";
import { mockAvailability } from "./volunteer-form/mock-data";
import VolunteerFormAvailabilityPartial from "./volunteer-form/partials/volunteer-form-availability.partial";

export const VolunteerFormAvailabilityRoute: React.FC = () => {
  const [data, setData] = useState<VolunteerFormAvailability>(mockAvailability);
  const navigate = useNavigate();
  return (
    <VolunteerFormAvailabilityPartial
      data={data}
      onChange={(field, value) =>
        setData((prev) => ({ ...prev, [field]: value }))
      }
      onNext={() => navigate("/volunteer-form/preferences")}
      onBack={() => navigate("/volunteer-form/personal-info")}
    />
  );
};

export default VolunteerFormAvailabilityRoute;
