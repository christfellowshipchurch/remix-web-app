import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  assignInitiatorWhenWorkflowAppears,
  assignRockWorkflowInitiator,
  buildRockWorkflowLaunchEndpoint,
  findLaunchedWorkflowId,
  getRockApiPersonAliasId,
  postRockWorkflowLaunchWithApiInitiator,
} from '../rock-workflow';
import {
  fetchRockData,
  patchRockData,
  postRockData,
} from '../fetch-rock-data';

vi.mock('../fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
  patchRockData: vi.fn(),
  postRockData: vi.fn(),
  TTL: { NONE: 0, DEFAULT: 3600, SHORT: 300, LONG: 86400 },
}));

describe('getRockApiPersonAliasId', () => {
  afterEach(() => {
    delete process.env.API_ALIAS_PERSON_ID;
  });

  it('returns 0 when env is unset', () => {
    expect(getRockApiPersonAliasId()).toBe('0');
  });

  it('returns trimmed numeric alias id when set', () => {
    process.env.API_ALIAS_PERSON_ID = '  99  ';
    expect(getRockApiPersonAliasId()).toBe('99');
  });

  it('falls back to 0 for invalid values', () => {
    process.env.API_ALIAS_PERSON_ID = 'not-a-number';
    expect(getRockApiPersonAliasId()).toBe('0');
  });
});

describe('buildRockWorkflowLaunchEndpoint', () => {
  afterEach(() => {
    delete process.env.API_ALIAS_PERSON_ID;
  });

  it('uses PersonAlias launch when API alias is configured', () => {
    process.env.API_ALIAS_PERSON_ID = '648297';

    expect(buildRockWorkflowLaunchEndpoint('1833', 'Journey Finder Sign Up')).toBe(
      'PersonAlias/LaunchWorkflow/648297?workflowTypeId=1833&workflowName=Journey%20Finder%20Sign%20Up',
    );
  });

  it('uses Workflows/LaunchWorkflow/0 when API alias is not configured', () => {
    expect(buildRockWorkflowLaunchEndpoint('1833', 'Journey Finder Sign Up')).toBe(
      'Workflows/LaunchWorkflow/0?workflowTypeId=1833&workflowName=Journey%20Finder%20Sign%20Up',
    );
  });
});

describe('assignRockWorkflowInitiator', () => {
  beforeEach(() => {
    vi.mocked(patchRockData).mockResolvedValue(204);
  });

  it('patches InitiatorPersonAliasId on the workflow', async () => {
    await assignRockWorkflowInitiator(42, '99');

    expect(patchRockData).toHaveBeenCalledWith({
      endpoint: 'Workflows/42',
      body: { InitiatorPersonAliasId: 99 },
    });
  });
});

describe('postRockWorkflowLaunchWithApiInitiator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.API_ALIAS_PERSON_ID;
    vi.mocked(postRockData).mockResolvedValue({});
    vi.mocked(patchRockData).mockResolvedValue(204);
  });

  it('launches without patching when API alias env is unset', async () => {
    vi.mocked(fetchRockData).mockResolvedValueOnce([{ Id: 1 }]);

    await postRockWorkflowLaunchWithApiInitiator({
      workflowTypeId: '1',
      workflowName: 'Test Workflow',
      body: { FirstName: 'A' },
    });

    expect(postRockData).toHaveBeenCalled();
    expect(patchRockData).not.toHaveBeenCalled();
  });

  it('returns after launch and patches initiator in the background', async () => {
    process.env.API_ALIAS_PERSON_ID = '648297';
    vi.mocked(fetchRockData)
      .mockResolvedValueOnce([{ Id: 5645000 }])
      .mockResolvedValue([{ Id: 5645999 }]);

    await postRockWorkflowLaunchWithApiInitiator({
      workflowTypeId: '1833',
      workflowName: 'Journey Finder Sign Up',
      body: { FirstName: 'Test' },
      instanceName: 'Test Person',
    });

    expect(postRockData).toHaveBeenCalledWith({
      endpoint:
        'PersonAlias/LaunchWorkflow/648297?workflowTypeId=1833&workflowName=Journey%20Finder%20Sign%20Up',
      body: { FirstName: 'Test' },
    });

    await vi.waitFor(() => {
      expect(patchRockData).toHaveBeenCalledWith({
        endpoint: 'Workflows/5645999',
        body: { InitiatorPersonAliasId: 648297 },
      });
    });
  });
});

describe('findLaunchedWorkflowId', () => {
  beforeEach(() => {
    vi.mocked(fetchRockData).mockReset();
  });

  it('returns null when no workflow is found', async () => {
    vi.mocked(fetchRockData).mockResolvedValue([]);

    const id = await findLaunchedWorkflowId({
      workflowTypeId: '1833',
      workflowIdAfter: 5645000,
      maxAttempts: 1,
      delayMs: 0,
    });

    expect(id).toBeNull();
  });

  it('reads id from a single-object fetchRockData response', async () => {
    vi.mocked(fetchRockData).mockResolvedValue({ Id: 5645999 });

    const id = await findLaunchedWorkflowId({
      workflowTypeId: '1833',
      workflowIdAfter: 5645000,
      maxAttempts: 1,
      delayMs: 0,
    });

    expect(id).toBe(5645999);
  });
});

describe('assignInitiatorWhenWorkflowAppears', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(patchRockData).mockResolvedValue(204);
    vi.mocked(fetchRockData).mockReset();
  });

  it('returns false when workflow is never found', async () => {
    vi.mocked(fetchRockData).mockResolvedValue([]);

    const ok = await assignInitiatorWhenWorkflowAppears({
      workflowTypeId: '1833',
      workflowIdAfter: 1,
      initiatorPersonAliasId: '99',
      maxAttempts: 1,
      delayMs: 0,
    });

    expect(ok).toBe(false);
    expect(patchRockData).not.toHaveBeenCalled();
  });
});
