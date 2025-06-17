import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { VolunteerFormPersonalInfo } from "./volunteer-form/types";
import { mockPersonalInfo } from "./volunteer-form/mock-data";
import VolunteerFormPersonalInfoPartial from "./volunteer-form/partials/volunteer-form-personal-info.partial";

export const VolunteerFormPersonalInfoRoute: React.FC = () => {
  const [data, setData] = useState<VolunteerFormPersonalInfo>(mockPersonalInfo);
  const navigate = useNavigate();
  return (
    <VolunteerFormPersonalInfoPartial
      data={data}
      onChange={(field, value) =>
        setData((prev) => ({ ...prev, [field]: value }))
      }
      onNext={() => navigate("/volunteer-form/availability")}
      onBack={() => navigate("/volunteer-form/welcome")}
    />
  );
};

export default VolunteerFormPersonalInfoRoute;
