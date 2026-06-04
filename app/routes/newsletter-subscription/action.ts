import { ActionFunction, data } from 'react-router-dom';
import { postRockData } from '~/lib/.server/fetch-rock-data';
import { NewsletterSubscriptionFormType } from './types';

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());
    const { FirstName, LastName, PhoneNumber, EmailAddress, Campus } = formData;

    const newsletterSubscriptionSubmission: NewsletterSubscriptionFormType = {
      FirstName: FirstName as string,
      LastName: LastName as string,
      PhoneNumber: PhoneNumber as string,
      EmailAddress: EmailAddress as string,
      Campus: Campus as string,
      LaunchSource: 'app',
    };

    await postRockData({
      endpoint:
        'Workflows/LaunchWorkflow/0?workflowTypeId=1202&workflowName=Newsletter%20Subscription',
      body: newsletterSubscriptionSubmission,
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
