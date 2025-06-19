import React, { useState } from "react";
import { ActionFunctionArgs, redirect, useNavigate } from "react-router-dom";
import type { VolunteerFormPersonalInfo } from "./volunteer-form/types";
import { mockPersonalInfo } from "./volunteer-form/mock-data";
import VolunteerFormPersonalInfoPartial from "./volunteer-form/partials/volunteer-form-personal-info.partial";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = {
    campus: formData.get("campus"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
  };
  console.log("Form data received:", data);

  // Here you would typically validate the data and save it
  // For now, we'll just redirect to the next page
  return redirect("/volunteer-form/availability");
};

export const VolunteerFormPersonalInfoRoute: React.FC = () => {
  const [data, setData] = useState<VolunteerFormPersonalInfo>(mockPersonalInfo);
  const navigate = useNavigate();
  return (
    <VolunteerFormPersonalInfoPartial
      data={data}
      onChange={(field, value) =>
        setData((prev) => ({ ...prev, [field]: value }))
      }
      onBack={() => navigate("/volunteer-form/welcome")}
    />
  );
};

export default VolunteerFormPersonalInfoRoute;
