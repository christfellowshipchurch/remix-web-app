import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('~/lib/.server/fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
  TTL: { DEFAULT: 3600, SHORT: 600, LONG: 86400, NONE: 0 },
}));

import { fetchRockData } from '~/lib/.server/fetch-rock-data';
import { fetchChurchRolesByPreferenceAreaGuid } from '../church-roles.server';

const mockFetch = fetchRockData as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

const BUCKET_GUID = 'aaaa-1111-2222-3333-bbbbbbbbbbbb';

describe('fetchChurchRolesByPreferenceAreaGuid', () => {
  it('calls Rock with the correct endpoint and query params', async () => {
    mockFetch.mockResolvedValueOnce([]);

    await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: 'ConnectionOpportunities/GetByAttributeValue',
        queryParams: expect.objectContaining({
          attributeKey: 'preferenceArea',
          value: BUCKET_GUID,
        }),
      }),
    );
  });

  it('maps summary first sentence to description and description HTML to expandedDescription', async () => {
    mockFetch.mockResolvedValueOnce([
      {
        guid: 'role-guid-1111-2222-3333-444444444444',
        name: 'First Impressions',
        summary: '<p>Welcome guests as they arrive. More detail here.</p>',
        description: '<p>Extended <strong>info</strong> about the role.</p>',
      },
    ]);

    const [role] = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(role.description).toBe('Welcome guests as they arrive.');
    expect(role.expandedDescription).toBe(
      '<p>Extended <strong>info</strong> about the role.</p>',
    );
  });

  it('maps a list of opportunities to ChurchRole[]', async () => {
    mockFetch.mockResolvedValueOnce([
      {
        guid: 'role-guid-1111-2222-3333-444444444444',
        name: 'First Impressions',
        summary: 'Welcome guests as they arrive.',
        description: '<p>Extended info about the role.</p>',
      },
      {
        guid: 'role-guid-2222-3333-4444-555555555555',
        name: 'Usher',
        summary: 'Help people find seats.',
        description: '<p>More details on ushering.</p>',
      },
    ]);

    const result = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'role-guid-1111-2222-3333-444444444444',
      title: 'First Impressions',
      description: 'Welcome guests as they arrive.',
      expandedDescription: '<p>Extended info about the role.</p>',
    });
    expect(result[1]).toEqual({
      id: 'role-guid-2222-3333-4444-555555555555',
      title: 'Usher',
      description: 'Help people find seats.',
      expandedDescription: '<p>More details on ushering.</p>',
    });
  });

  it('strips HTML tags from summary before extracting first sentence', async () => {
    mockFetch.mockResolvedValueOnce([
      {
        guid: 'role-guid-1111-2222-3333-444444444444',
        name: 'Host Team',
        summary: '<p>Serve <strong>coffee</strong> and welcome guests. Then do more things.</p>',
      },
    ]);

    const [role] = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(role.description).toBe('Serve coffee and welcome guests.');
    expect(role.description).not.toContain('<');
  });

  it('returns the full text when summary has no sentence-ending punctuation', async () => {
    mockFetch.mockResolvedValueOnce([
      {
        guid: 'role-guid-1111-2222-3333-444444444444',
        name: 'Host Team',
        summary: 'A role with no period',
      },
    ]);

    const [role] = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(role.description).toBe('A role with no period');
  });

  it('sets description to empty string when summary is absent', async () => {
    mockFetch.mockResolvedValueOnce([
      {
        guid: 'role-guid-1111-2222-3333-444444444444',
        name: 'Host Team',
        description: '<p>Full HTML description.</p>',
      },
    ]);

    const [role] = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(role.description).toBe('');
  });

  it('omits expandedDescription when description field is absent', async () => {
    mockFetch.mockResolvedValueOnce([
      {
        guid: 'role-guid-1111-2222-3333-444444444444',
        name: 'Host Team',
        summary: 'Serve coffee and welcome guests.',
      },
    ]);

    const [role] = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(role.expandedDescription).toBeUndefined();
  });

  it('handles a single Rock object (not an array)', async () => {
    mockFetch.mockResolvedValueOnce({
      guid: 'role-guid-solo-2222-3333-444444444444',
      name: 'Parking Team',
      summary: 'Guide cars in the lot.',
      description: '<p>Details about parking.</p>',
    });

    const result = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Parking Team');
  });

  it('skips items missing a guid', async () => {
    mockFetch.mockResolvedValueOnce([
      { name: 'No GUID role', summary: 'Some summary.' },
      {
        guid: 'role-guid-valid-2222-3333-444444444444',
        name: 'Valid Role',
        summary: 'Valid summary.',
      },
    ]);

    const result = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Valid Role');
  });

  it('skips items missing a name', async () => {
    mockFetch.mockResolvedValueOnce([
      { guid: 'role-guid-1111-2222-3333-444444444444', summary: 'No name.' },
    ]);

    const result = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(result).toHaveLength(0);
  });

  it('returns empty array when Rock returns null', async () => {
    mockFetch.mockResolvedValueOnce(null);

    const result = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(result).toEqual([]);
  });

  it('returns empty array when Rock returns an empty array', async () => {
    mockFetch.mockResolvedValueOnce([]);

    const result = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(result).toEqual([]);
  });

  it('returns empty array when Rock throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'));

    const result = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(result).toEqual([]);
  });

  it('preserves Rock ordering', async () => {
    const makeItem = (n: number) => ({
      guid: `role-guid-${n}000-0000-0000-000000000000`,
      name: `Role ${n}`,
      summary: `Summary ${n}.`,
    });

    mockFetch.mockResolvedValueOnce([makeItem(1), makeItem(2), makeItem(3)]);

    const result = await fetchChurchRolesByPreferenceAreaGuid(BUCKET_GUID);

    expect(result.map((r) => r.title)).toEqual(['Role 1', 'Role 2', 'Role 3']);
  });
});
