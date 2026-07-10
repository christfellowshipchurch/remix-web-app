import { ActionFunction, data } from 'react-router-dom';
import { buildConnectCardSubmission } from './build-submission';
import {
  buildRockWorkflowLaunchEndpoint,
  postRockWorkflowLaunchWithApiInitiator,
} from '~/lib/.server/rock-workflow';

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());
    const submission = buildConnectCardSubmission(formData);
    const instanceName =
      `${submission.body.FirstName} ${submission.body.LastName}`.trim();

    // Debug: log payload before submitting to Rock
    // eslint-disable-next-line no-console -- temporary connect card debug
    console.log('[Connect Card] Submitting to Rock');
    // eslint-disable-next-line no-console -- temporary connect card debug
    console.log('[Connect Card] Raw form data:', submission.rawFormData);
    // eslint-disable-next-line no-console -- temporary connect card debug
    console.log('[Connect Card] Workflow type ID:', submission.workflowTypeId);
    // eslint-disable-next-line no-console -- temporary connect card debug
    console.log(
      '[Connect Card] Rock endpoint:',
      buildRockWorkflowLaunchEndpoint(
        submission.workflowTypeId,
        submission.workflowName,
      ),
    );
    // eslint-disable-next-line no-console -- temporary connect card debug
    console.log('[Connect Card] Rock body:', submission.body);

    // --- Live Rock submission ---
    await postRockWorkflowLaunchWithApiInitiator({
      workflowTypeId: submission.workflowTypeId,
      workflowName: submission.workflowName,
      body: submission.body,
      instanceName,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: 'Network error please try again' }, { status: 400 });
  }
};
