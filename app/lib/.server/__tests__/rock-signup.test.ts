import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  findOrCreateRockPersonForSignup,
  launchGroupClassSignupWorkflow,
} from '../rock-signup';

vi.mock('../fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
  postRockData: vi.fn(),
  TTL: { NONE: 0 },
}));
vi.mock('../rock-utils', () => ({
  escapeOData: vi.fn((v: string) => v),
}));
vi.mock('../rock-person', () => ({
  updatePerson: vi.fn(),
}));
vi.mock('../authentication/rock-authentication', () => ({
  fetchUserLogin: vi.fn(),
  createUserProfile: vi.fn(),
}));
vi.mock('../authentication/sms-authentication', () => ({
  parsePhoneNumberUtil: vi.fn(() => ({ significantNumber: '5551234567', countryCode: 1 })),
  createPhoneNumberInRock: vi.fn(),
}));
vi.mock('../redis-config', () => ({ default: null }));

import { fetchRockData, postRockData } from '../fetch-rock-data';
import { updatePerson } from '../rock-person';
import { fetchUserLogin, createUserProfile } from '../authentication/rock-authentication';
import { createPhoneNumberInRock } from '../authentication/sms-authentication';

const mockFetchRockData = fetchRockData as ReturnType<typeof vi.fn>;
const mockPostRockData = postRockData as ReturnType<typeof vi.fn>;
const mockUpdatePerson = updatePerson as ReturnType<typeof vi.fn>;
const mockFetchUserLogin = fetchUserLogin as ReturnType<typeof vi.fn>;
const mockCreateUserProfile = createUserProfile as ReturnType<typeof vi.fn>;
const mockCreatePhoneNumberInRock = createPhoneNumberInRock as ReturnType<typeof vi.fn>;

const defaultInput = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phoneNumber: '5551234567',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUpdatePerson.mockResolvedValue(undefined);
  mockCreatePhoneNumberInRock.mockResolvedValue(undefined);
});

describe('findOrCreateRockPersonForSignup', () => {
  // updatePerson only patches email when the Rock person has none, and only creates
  // a phone entry when none exists for the number — see rock-person.ts for implementation.
  // These tests verify that updatePerson is invoked after each successful lookup step.

  it('Step 1 — returns personId when email login matches', async () => {
    mockFetchUserLogin.mockResolvedValueOnce({ personId: 42 });

    const result = await findOrCreateRockPersonForSignup(defaultInput);

    expect(result).toBe('42');
    expect(mockUpdatePerson).toHaveBeenCalledOnce();
    expect(mockUpdatePerson).toHaveBeenCalledWith('42', {
      email: defaultInput.email,
      phoneNumber: defaultInput.phoneNumber,
    });
  });

  it('Step 2 — returns personId when phone login matches', async () => {
    mockFetchUserLogin
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ personId: 99 });

    const result = await findOrCreateRockPersonForSignup(defaultInput);

    expect(result).toBe('99');
    expect(mockUpdatePerson).toHaveBeenCalledOnce();
    expect(mockUpdatePerson).toHaveBeenCalledWith('99', {
      email: defaultInput.email,
      phoneNumber: defaultInput.phoneNumber,
    });
  });

  it('Step 3 — returns personId when People OData name+email matches', async () => {
    mockFetchUserLogin.mockResolvedValue(null);
    mockFetchRockData.mockResolvedValueOnce([{ id: 77 }]);

    const result = await findOrCreateRockPersonForSignup(defaultInput);

    expect(result).toBe('77');
    expect(mockUpdatePerson).toHaveBeenCalledOnce();
    expect(mockUpdatePerson).toHaveBeenCalledWith('77', {
      email: defaultInput.email,
      phoneNumber: defaultInput.phoneNumber,
    });
  });

  it('Step 4 — returns personId when PhoneNumbers name matches', async () => {
    mockFetchUserLogin.mockResolvedValue(null);
    mockFetchRockData
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ personId: 55 }])
      .mockResolvedValueOnce({ firstName: 'Jane', lastName: 'Doe' });

    const result = await findOrCreateRockPersonForSignup(defaultInput);

    expect(result).toBe('55');
    expect(mockUpdatePerson).toHaveBeenCalledOnce();
    expect(mockUpdatePerson).toHaveBeenCalledWith('55', {
      email: defaultInput.email,
      phoneNumber: defaultInput.phoneNumber,
    });
  });

  it('Step 4 — returns personId when People lookup returns array response', async () => {
    mockFetchUserLogin.mockResolvedValue(null);
    mockFetchRockData
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ personId: 55 }])
      .mockResolvedValueOnce([{ firstName: 'Jane', lastName: 'Doe' }]);

    const result = await findOrCreateRockPersonForSignup(defaultInput);

    expect(result).toBe('55');
    expect(mockUpdatePerson).toHaveBeenCalledOnce();
    expect(mockUpdatePerson).toHaveBeenCalledWith('55', {
      email: defaultInput.email,
      phoneNumber: defaultInput.phoneNumber,
    });
  });

  it('Step 5 — creates new person when no match found', async () => {
    mockFetchUserLogin.mockResolvedValue(null);
    mockFetchRockData
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    mockCreateUserProfile.mockResolvedValue(123);

    const result = await findOrCreateRockPersonForSignup(defaultInput);

    expect(result).toBe('123');
    expect(mockUpdatePerson).not.toHaveBeenCalled();
    expect(mockCreatePhoneNumberInRock).toHaveBeenCalledOnce();
    expect(mockCreatePhoneNumberInRock).toHaveBeenCalledWith({
      personId: 123,
      phoneNumber: defaultInput.phoneNumber,
      countryCode: 1,
    });
  });
});

describe('launchGroupClassSignupWorkflow', () => {
  it('calls postRockData with endpoint containing workflowTypeId=654 and correct body casing', async () => {
    mockPostRockData.mockResolvedValue({});

    await launchGroupClassSignupWorkflow('group-1', 'person-2');

    expect(mockPostRockData).toHaveBeenCalledOnce();
    const [call] = mockPostRockData.mock.calls[0] as [{ endpoint: string; body: Record<string, string> }];
    expect(call.endpoint).toContain('workflowTypeId=654');
    expect(call.body).toEqual({ GroupId: 'group-1', PersonId: 'person-2' });
  });
});
