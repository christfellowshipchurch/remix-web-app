import { ActionFunction, data } from "react-router";
import { ConnectFormType } from "./types";
import { postRockData } from "~/lib/.server/fetchRockData";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());

    const allThatAppliesValues: string = Object.keys(formData)
      .filter((key) => key.includes("allThatApplies"))
      .map((key) => formData[key])
      .join(",");

    const {
      email,
      firstName,
      lastName,
      phone,
      otherContent,
      campus,
      decision,
    } = formData;

    const connectFormSubmission: ConnectFormType = {
      FirstName: firstName as string,
      LastName: lastName as string,
      Campus: campus as string,
      Email: email as string,
      PhoneNumber: phone as string,
      AllThatApplies: allThatAppliesValues,
    };

    if (decision) {
      connectFormSubmission.Decision = decision as string;
    }
    if (otherContent) {
      connectFormSubmission.Other = otherContent as string;
    }

    const sendForm = await postRockData(
      `Workflows/LaunchWorkflow/0?workflowTypeId=902&workflowName=CFDP%20Web%20Connect%20Card`,
      connectFormSubmission
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: "Network error please try again" }, { status: 400 });
  }
};
