import type { ActionFunctionArgs } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { postRockData } from '~/lib/.server/fetch-rock-data';
import { action } from './action';

vi.mock('~/lib/.server/fetch-rock-data', () => ({
  postRockData: vi.fn(),
}));

const createRequest = (language?: 'English' | 'Spanish') => {
  const formData = new FormData();
  formData.set('firstName', 'Test');
  formData.set('lastName', 'Person');
  formData.set('phone', '5555555555');
  formData.set('email', 'test@example.com');
  formData.set('atCF', '1');

  const searchParams = new URLSearchParams({ Group: 'group-guid-123' });
  if (language) {
    searchParams.set('Language', language);
  }

  return new Request(
    `http://localhost/journey-finder-sign-up?${searchParams.toString()}`,
    {
      method: 'POST',
      body: formData,
    },
  );
};

describe('journey finder sign up action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(postRockData).mockResolvedValue({});
  });

  it('posts English submissions to workflow ID 1872 by default', async () => {
    await action({ request: createRequest() } as ActionFunctionArgs);

    expect(postRockData).toHaveBeenCalledWith({
      endpoint:
        'Workflows/LaunchWorkflow/0?workflowTypeId=1872&workflowName=Journey%20Finder%20Sign%20Up',
      body: expect.objectContaining({
        Group: 'group-guid-123',
        LaunchSource: 'app',
      }),
    });
  });

  it('posts Spanish submissions to workflow ID 1835', async () => {
    await action({
      request: createRequest('Spanish'),
    } as ActionFunctionArgs);

    expect(postRockData).toHaveBeenCalledWith({
      endpoint:
        'Workflows/LaunchWorkflow/0?workflowTypeId=1835&workflowName=Journey%20Finder%20Sign%20Up',
      body: expect.objectContaining({
        Group: 'group-guid-123',
        LaunchSource: 'app',
      }),
    });
  });
});
