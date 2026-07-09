import type { ActionFunctionArgs } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { postRockData } from '~/lib/.server/fetch-rock-data';
import { action } from './action';

vi.mock('~/lib/.server/fetch-rock-data', () => ({
  postRockData: vi.fn(),
}));

const createFormData = () => {
  const formData = new FormData();
  formData.set('firstName', 'Test');
  formData.set('lastName', 'Person');
  formData.set('phone', '5555555555');
  formData.set('email', 'test@example.com');
  formData.set('campus', 'campus-guid-123');
  formData.set('birthdate', '2000-01-01');
  formData.set('addressLine1', '123 Main St');
  formData.set('addressLine2', 'Apt 2');
  formData.set('city', 'Palm Beach Gardens');
  formData.set('state', 'FL');
  formData.set('zip', '33418');
  formData.set('tShirtSize', 'M');
  formData.set('myStory', 'I am ready.');
  formData.set('shareYourStory', 'Yes');
  return formData;
};

const createRequest = (options: {
  group?: string;
  language?: 'English' | 'Spanish';
}) => {
  const searchParams = new URLSearchParams();
  if (options.group) {
    searchParams.set('Group', options.group);
  }
  if (options.language) {
    searchParams.set('Language', options.language);
  }

  return new Request(
    `http://localhost/baptism-sign-up?${searchParams.toString()}`,
    {
      method: 'POST',
      body: createFormData(),
    },
  );
};

describe('baptism sign up action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(postRockData).mockResolvedValue(undefined);
  });

  it('posts English submissions to workflow ID 1465 by default', async () => {
    await action({
      request: createRequest({ group: 'group-guid-123' }),
    } as ActionFunctionArgs);

    expect(postRockData).toHaveBeenCalledWith({
      endpoint:
        'Workflows/LaunchWorkflow/0?workflowTypeId=1465&workflowName=Baptism%20Finder%20Sign%20Up',
      body: expect.objectContaining({
        Group: 'group-guid-123',
        LaunchSource: 'app',
        FirstName: 'Test',
        LastName: 'Person',
        Campus1: 'campus-guid-123',
      }),
    });
  });

  it('posts Spanish submissions to workflow ID 1644', async () => {
    await action({
      request: createRequest({
        group: 'spanish-group-guid-123',
        language: 'Spanish',
      }),
    } as ActionFunctionArgs);

    expect(postRockData).toHaveBeenCalledWith({
      endpoint:
        'Workflows/LaunchWorkflow/0?workflowTypeId=1644&workflowName=Baptism%20Finder%20Sign%20Up',
      body: expect.objectContaining({
        Group: 'spanish-group-guid-123',
        LaunchSource: 'app',
      }),
    });
  });

  it('returns 400 when Group is missing', async () => {
    const response = (await action({
      request: createRequest({}),
    } as ActionFunctionArgs)) as {
      data: { error: string };
      init: { status: number };
    };

    expect(response.init.status).toBe(400);
    expect(response.data).toEqual({ error: 'Missing required fields' });
    expect(postRockData).not.toHaveBeenCalled();
  });
});
