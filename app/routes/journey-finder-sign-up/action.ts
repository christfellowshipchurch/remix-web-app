import { ActionFunction, data } from 'react-router-dom';
import { JourneyFinderSignUpFormType } from './types';
import { postRockData } from '~/lib/.server/fetch-rock-data';
import { findOrCreateRockPersonForSignup } from '~/lib/.server/rock-signup';

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());

    const firstName = formData.firstName?.toString() ?? '';
    const lastName = formData.lastName?.toString() ?? '';
    const phone = formData.phone?.toString() ?? '';
    const email = formData.email?.toString() ?? '';
    const atCF = formData.atCF?.toString() ?? '';
    const hopeToGet = formData.hopeToGet?.toString() ?? '';

    const url = new URL(request.url);
    const group = url.searchParams.get('Group') ?? '';

    if (!firstName || !lastName || !phone || !email || !atCF || !group) {
      return data({ error: 'Missing required fields' }, { status: 400 });
    }

    const personId = await findOrCreateRockPersonForSignup({
      firstName,
      lastName,
      email,
      phoneNumber: phone,
    });

    const submission: JourneyFinderSignUpFormType = {
      FirstName: firstName,
      LastName: lastName,
      PrimaryPhoneNumber: phone,
      EmailAddress: email,
      AtCF: atCF,
      OriginalEntrySource: 'Web',
      LaunchSource: 'app',
      Group: group,
      PersonId: personId,
    };

    if (hopeToGet) {
      submission.hopetoget = hopeToGet;
    }

    await postRockData({
      endpoint: `Workflows/LaunchWorkflow/0?workflowTypeId=1833&workflowName=Journey%20Finder%20Sign%20Up`,
      body: submission,
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
