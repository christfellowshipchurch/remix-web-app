import { ActionFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { mockPersonalInfo } from "./volunteer-form/mock-data";
import YesAboutYou from "./yes/partials/yes-about-you.partial";
import { YesFormPersonalInfo } from "./yes/types";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
  };
  console.log("Personal Info received:", data);

  // TODO: Validate data and save it

  return redirect("/yes/devotional");
};

export const loader = async () => {
  return new Response(JSON.stringify({ defaultValues: mockPersonalInfo }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const YesAboutYouRoute: React.FC = () => {
  const { defaultValues } = useLoaderData() as {
    defaultValues: YesFormPersonalInfo;
  };
  return <YesAboutYou data={defaultValues} />;
};

export default YesAboutYouRoute;
