import { ActionFunction, json } from "@remix-run/node";
import { SetAReminderType } from "./types";
import { fetchRockData, postRockData } from "~/lib/.server/fetchRockData";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());

    const { email, firstName, lastName, phone, campus, serviceTime } = formData;

    const getCampusGuid: { guid: string } = await fetchRockData("Campuses", {
      $filter: `Name eq '${campus}'`,
      $select: "Guid",
    });

    const formSubmission: SetAReminderType = {
      FirstName: firstName as string,
      LastName: lastName as string,
      CampusLocation: getCampusGuid?.guid,
      Email: email as string,
      PhoneNumber: phone as string,
      ServiceTime: serviceTime as string,
    };

    console.log(formSubmission);

    // Trigger the workflow for setting a reminder
    await postRockData(
      `Workflows/LaunchWorkflow/0?workflowTypeId=936&workflowName=Set%20a%20Reminder`,
      formSubmission
    );

    return json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ error: "Network error please try again" }, { status: 400 });
  }
};
