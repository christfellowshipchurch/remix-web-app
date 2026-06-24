import type { LoaderFunctionArgs } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRockData } from '~/lib/.server/fetch-rock-data';
import { loader } from '../api.connect-card-prefill';

vi.mock('~/lib/.server/fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
  TTL: { NONE: 0 },
}));

const mockFetchRockData = vi.mocked(fetchRockData);

const createArgs = (search = '') =>
  ({
    request: new Request(`http://localhost/api/connect-card-prefill${search}`),
    params: {},
    context: {},
  }) as LoaderFunctionArgs;

const readData = (response: unknown) => (response as { data: unknown }).data;

const readStatus = (response: unknown) =>
  (response as { init?: { status?: number } }).init?.status;

describe('connect card prefill API', () => {
  beforeEach(() => {
    mockFetchRockData.mockReset();
  });

  it('returns invalid-id for missing or non-numeric rckipid values', async () => {
    const missing = await loader(createArgs());
    const invalid = await loader(createArgs('?rckipid=abc'));

    expect(readData(missing)).toEqual({ status: 'invalid-id' });
    expect(readData(invalid)).toEqual({ status: 'invalid-id' });
    expect(mockFetchRockData).not.toHaveBeenCalled();
  });

  it('returns not-found when Rock does not return a person', async () => {
    mockFetchRockData.mockResolvedValueOnce(null);

    const response = await loader(createArgs('?rckipid=123'));

    expect(readData(response)).toEqual({ status: 'not-found' });
    expect(mockFetchRockData).toHaveBeenCalledWith({
      endpoint: 'People/123',
      queryParams: {
        $select: 'FirstName,LastName,Email,PrimaryCampusId',
      },
      ttl: 0,
    });
  });

  it('accepts the mobile app rckpid alias', async () => {
    mockFetchRockData
      .mockResolvedValueOnce({
        firstName: 'Jane',
        primaryCampusId: 10,
      })
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 10, guid: 'campus-guid' }]);

    const response = await loader(createArgs('?rckpid=123'));

    expect(readData(response)).toEqual({
      status: 'success',
      prefill: {
        firstName: 'Jane',
        campus: 'campus-guid',
      },
    });
    expect(mockFetchRockData).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        endpoint: 'People/123',
      }),
    );
  });

  it('maps Rock person, phone, and campus data to a minimal prefill response', async () => {
    mockFetchRockData
      .mockResolvedValueOnce({
        id: 123,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        primaryCampusId: 10,
        recordStatusValueId: 3,
      })
      .mockResolvedValueOnce([
        {
          number: '5551234567',
          numberFormatted: '555-123-4567',
          extension: '999',
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 10,
          name: 'Palm Beach Gardens',
          guid: 'campus-guid',
          extra: 'not returned',
        },
      ]);

    const response = await loader(createArgs('?rckipid=123'));

    expect(readData(response)).toEqual({
      status: 'success',
      prefill: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-123-4567',
        campus: 'campus-guid',
      },
    });
    expect(mockFetchRockData).toHaveBeenNthCalledWith(2, {
      endpoint: 'PhoneNumbers',
      queryParams: {
        $filter: 'PersonId eq 123',
        $select: 'Number,NumberFormatted',
      },
      ttl: 0,
    });
    expect(mockFetchRockData).toHaveBeenNthCalledWith(3, {
      endpoint: 'Campuses',
      queryParams: {
        $filter: 'IsActive eq true',
        $orderby: 'Order',
        $select: 'Id,Name,Guid',
      },
      ttl: 0,
    });
  });

  it('uses a person campus guid when Rock returns one directly', async () => {
    mockFetchRockData
      .mockResolvedValueOnce({
        firstName: 'Jane',
        primaryCampus: { guid: 'direct-campus-guid' },
      })
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const response = await loader(createArgs('?rckipid=123'));

    expect(readData(response)).toEqual({
      status: 'success',
      prefill: {
        firstName: 'Jane',
        campus: 'direct-campus-guid',
      },
    });
  });

  it('returns error when a Rock request fails', async () => {
    mockFetchRockData.mockRejectedValueOnce(new Error('Rock unavailable'));

    const response = await loader(createArgs('?rckipid=123'));

    expect(readStatus(response)).toBe(500);
    expect(readData(response)).toEqual({
      status: 'error',
      message: 'Unable to load prefill data',
    });
  });
});
