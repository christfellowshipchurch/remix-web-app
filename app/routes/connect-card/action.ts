import { ActionFunction, json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const allThatAppliesValues = Object.keys(formData)
    .filter((key) => key.includes("allThatApplies"))
    .map((key) => formData[key])
    .join(", ");

  const { email, firstName, lastName, phone, other, campus } = formData;

  console.log({
    email,
    firstName,
    lastName,
    phone,
    other,
    campus,
    allThatAppliesValues,
  });

  return json({ success: true });
};
