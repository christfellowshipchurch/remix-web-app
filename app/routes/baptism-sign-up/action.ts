import { ActionFunction, data } from 'react-router-dom';
import { BaptismSignUpFormType } from './types';
import { postRockData } from '~/lib/.server/fetch-rock-data';

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());
    const url = new URL(request.url);
    const group = url.searchParams.get('Group') ?? '';
    const language =
      url.searchParams.get('Language') === 'Spanish' ? 'Spanish' : 'English';
    const workflowTypeId = language === 'Spanish' ? '1644' : '1465';

    const {
      firstName,
      lastName,
      phone,
      email,
      campus,
      birthdate,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      tShirtSize,
      myStory,
      shareYourStory,
      areYouInHighSchool,
      grade,
      gFirstName,
      gLastName,
      guardiansEmail,
      guardiansPhone,
      relationship,
    } = formData;

    if (!group) {
      return data({ error: 'Missing required fields' }, { status: 400 });
    }

    // Combine the collected subfields into the single Rock `Address` attribute
    // (e.g. "123 Main St, Apt 2, Stuart, FL 34997"). Empty parts are dropped.
    const localityLine = [
      city as string,
      [state, zip].filter(Boolean).join(' ').trim(),
    ]
      .filter(Boolean)
      .join(', ');
    const address = [
      addressLine1 as string,
      addressLine2 as string,
      localityLine,
    ]
      .filter(Boolean)
      .join(', ');

    const baptismSignUpSubmission: BaptismSignUpFormType = {
      FirstName: firstName as string,
      LastName: lastName as string,
      PhoneNumber: phone as string,
      EmailAddress: email as string,
      Campus1: campus as string,
      Birthdate: birthdate as string,
      Address: address,
      'T-ShirtSize': tShirtSize as string,
      ShareYourStory: shareYourStory as string,
      MyStory: myStory as string,
      LaunchSource: 'app',
      Group: group,
    };

    // Age-conditional fields — the form only submits these when its age logic
    // requires them, so include each only when present rather than sending
    // empty strings.
    if (areYouInHighSchool) {
      baptismSignUpSubmission.AreyouinHighSchool = areYouInHighSchool as string;
    }
    if (grade) {
      baptismSignUpSubmission.Grade = grade as string;
    }
    if (gFirstName) {
      baptismSignUpSubmission.GFirstName = gFirstName as string;
    }
    if (gLastName) {
      baptismSignUpSubmission.GLastName = gLastName as string;
    }
    if (guardiansEmail) {
      baptismSignUpSubmission.GuardiansEmail = guardiansEmail as string;
    }
    if (guardiansPhone) {
      baptismSignUpSubmission.GuardiansPhoneNumber = guardiansPhone as string;
    }
    if (relationship) {
      baptismSignUpSubmission.Relationship = relationship as string;
    }

    await postRockData({
      endpoint: `Workflows/LaunchWorkflow/0?workflowTypeId=${workflowTypeId}&workflowName=Baptism%20Finder%20Sign%20Up`,
      body: baptismSignUpSubmission,
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
