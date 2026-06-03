import { ActionFunction, data } from 'react-router-dom';
import { PrayerRequestFormType } from './types';
import { postRockData } from '~/lib/.server/fetch-rock-data';

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());

    const {
      FirstName,
      LastName,
      Email,
      MobilePhone,
      Campus,
      Request,
      FollowUp,
    } = formData;

    const prayerRequestSubmission: PrayerRequestFormType = {
      FirstName: FirstName as string,
      LastName: LastName as string,
      Email: Email as string,
      MobilePhone: MobilePhone as string,
      Campus: Campus as string,
      Request: Request as string,
      LaunchSource: 'app',
      SendingFormName: 'CFDP App Prayer Request',
    };

    if (FollowUp) {
      prayerRequestSubmission.FollowUp = FollowUp as string;
    }

    await postRockData({
      endpoint:
        'Workflows/LaunchWorkflow/0?workflowTypeId=348&workflowName=CFDP%20App%20Prayer%20Request',
      body: prayerRequestSubmission,
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
