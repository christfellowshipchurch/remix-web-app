import React from "react";
import {
  ActionFunctionArgs,
  redirect,
  useNavigate,
  useLoaderData,
} from "react-router-dom";
import type { VolunteerFormPreferences } from "./volunteer-form/types";
import { mockPreferences } from "./volunteer-form/mock-data";
import VolunteerFormPreferencesPartial from "./volunteer-form/partials/volunteer-form-preferences.partial";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const interests = formData.getAll("interests");
  const backgroundCheck = formData.get("backgroundCheck") === "true";
  const ssn = formData.get("ssn");

  const errors: Partial<Record<keyof VolunteerFormPreferences, string>> = {};

  if (interests.length === 0) {
    errors.interests = "Please select at least one interest.";
  }

  if (backgroundCheck && (!ssn || ssn.toString().trim().length !== 9)) {
    errors.ssn = "Please enter a complete 9-digit SSN.";
  }

  const defaultValues = Object.fromEntries(
    formData
  ) as unknown as VolunteerFormPreferences;

  if (Object.keys(errors).length > 0) {
    return new Response(JSON.stringify({ errors, defaultValues }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // TODO: Save data
  console.log("Preferences Info received:", defaultValues);
  return redirect("/volunteer-form/confirmation");
};

export const loader = async () => {
  return new Response(JSON.stringify({ defaultValues: mockPreferences }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const VolunteerFormPreferencesRoute: React.FC = () => {
  const { defaultValues } = useLoaderData() as {
    defaultValues: VolunteerFormPreferences;
  };
  const navigate = useNavigate();
  return (
    <VolunteerFormPreferencesPartial
      data={defaultValues}
      onBack={() => navigate("/volunteer-form/availability")}
    />
  );
};

export default VolunteerFormPreferencesRoute;
