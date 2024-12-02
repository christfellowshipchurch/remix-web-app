import { ActionFunction, json } from "@remix-run/node";
import { SetAReminderType } from "./types";
import { postRockData } from "~/lib/.server/fetchRockData";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());

    const { email, firstName, lastName, phone, campus, servicetime } = formData;

    const connectFormSubmission: SetAReminderType = {
      FirstName: firstName as string,
      LastName: lastName as string,
      Campus: campus as string, // TODO: campus guid??
      Email: email as string,
      PhoneNumber: phone as string,
      ServiceTime: servicetime as string,
    };

    // TODO: Update
    // const sendForm = await postRockData(
    //   `Workflows/LaunchWorkflow/0?workflowTypeId=902&workflowName=CFDP%20Web%20Connect%20Card`,
    //   connectFormSubmission
    // );

    return json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ error: "Network error please try again" }, { status: 400 });
  }
};
