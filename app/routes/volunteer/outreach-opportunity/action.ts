import type { ActionFunctionArgs } from 'react-router';

import { launchCommunityServingSignupWorkflow } from '~/lib/.server/rock-signup';
import { RockCampuses } from '~/lib/rock-config';

const ROCK_GUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CAMPUSES = new Set<string>(
  RockCampuses.filter((c) => c.name !== 'Online').map((c) => c.name),
);

const isTruthyCheckbox = (value: string): boolean =>
  value === 'true' || value === 'on' || value === 'yes' || value === 'Yes';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const formData = Object.fromEntries(await request.formData());

    const firstName = formData.firstName?.toString().trim() ?? '';
    const lastName = formData.lastName?.toString().trim() ?? '';
    const phoneNumber = formData.phoneNumber?.toString().trim() ?? '';
    const email = formData.email?.toString().trim() ?? '';
    const birthdate = formData.birthdate?.toString().trim() ?? '';
    const campus = formData.campus?.toString().trim() ?? '';
    const waiverAccepted = isTruthyCheckbox(
      formData.waiverAccepted?.toString() ?? '',
    );

    const rawGuid = (params.groupGuid ?? '').trim();
    const groupGuid = rawGuid.toUpperCase();

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !birthdate ||
      !campus ||
      !groupGuid
    ) {
      return Response.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    if (!ROCK_GUID_RE.test(groupGuid)) {
      return Response.json(
        { error: 'Invalid opportunity reference.' },
        { status: 400 },
      );
    }

    if (!ISO_DATE_RE.test(birthdate)) {
      return Response.json(
        { error: 'Please enter a valid birthdate.' },
        { status: 400 },
      );
    }

    const birthdateMs = Date.parse(`${birthdate}T00:00:00Z`);
    if (!Number.isFinite(birthdateMs) || birthdateMs >= Date.now()) {
      return Response.json(
        { error: 'Please enter a valid birthdate.' },
        { status: 400 },
      );
    }

    if (!CAMPUSES.has(campus)) {
      return Response.json(
        { error: 'Please select a valid campus.' },
        { status: 400 },
      );
    }

    if (!waiverAccepted) {
      return Response.json(
        { error: 'You must accept the waiver to sign up.' },
        { status: 400 },
      );
    }

    await launchCommunityServingSignupWorkflow({
      groupGuid,
      firstName,
      lastName,
      email,
      phoneNumber,
      birthdate,
      campus,
      waiverAccepted: true,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      },
      { status: 400 },
    );
  }
};
