import {
  type ActionFunction,
  type LoaderFunction,
  data,
} from 'react-router-dom';
import type { HelpMeFindAGroupFormType } from '~/components/modals/help-me-find-a-group/types';
import type { HelpMeFindAGroupLoaderReturnType } from '~/components/modals/help-me-find-a-group/types';
import { fetchRockData, postRockData } from '~/lib/.server/fetch-rock-data';

const HUB_DEFINED_TYPE_ID = 366;

export const loader: LoaderFunction = async () => {
  const [campuses, hubs] = await Promise.all([
    fetchRockData({
      endpoint: 'Campuses',
      queryParams: {
        $filter: 'IsActive eq true',
        $orderby: 'Order',
        $select: 'Name, Guid',
      },
    }),
    fetchRockData({
      endpoint: 'DefinedValues',
      queryParams: {
        $filter: `DefinedTypeId eq ${HUB_DEFINED_TYPE_ID} and IsActive eq true`,
        $orderby: 'Order',
        $select: 'Guid, Value',
      },
    }),
  ]);

  const loaderData: HelpMeFindAGroupLoaderReturnType = {
    campuses,
    hubs,
  };

  return loaderData;
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();

    const FirstName = formData.get('FirstName')?.toString().trim();
    const LastName = formData.get('LastName')?.toString().trim();
    const EmailAddress = formData.get('EmailAddress')?.toString().trim();
    const PhoneNumber = formData.get('PhoneNumber')?.toString().trim();
    const Campus = formData.get('Campus')?.toString().trim();
    const Type = formData.get('Type')?.toString().trim();
    const Comments = formData.get('Comments')?.toString().trim();
    const hubGuids = formData.getAll('Hub').map(String).filter(Boolean);

    if (
      !FirstName ||
      !LastName ||
      !EmailAddress ||
      !PhoneNumber ||
      !Campus ||
      !Type
    ) {
      return data(
        { error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    if (hubGuids.length === 0) {
      return data(
        { error: 'Please select at least one area.' },
        { status: 400 },
      );
    }

    const submission: HelpMeFindAGroupFormType = {
      FirstName,
      LastName,
      EmailAddress,
      PhoneNumber,
      Campus,
      Type,
      Hub: hubGuids.join(','),
      LaunchSource: 'app',
      SendingFormName: 'CFDP App Help Me Find a Group',
    };

    if (Comments) {
      submission.Comments = Comments;
    }

    await postRockData({
      endpoint: `Workflows/LaunchWorkflow/0?workflowTypeId=419&workflowName=${encodeURIComponent('Help Me Find a Group')}`,
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
