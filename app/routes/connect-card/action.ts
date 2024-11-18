import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  console.log("action triggered!!!");

  //trigger workflow

  return null;
};
