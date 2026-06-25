import type { LoaderFunctionArgs } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRockData, postRockData } from '~/lib/.server/fetch-rock-data';
import { loader } from '../api.connect-card-prefill';

vi.mock('~/lib/.server/fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
  postRockData: vi.fn(),
  TTL: { NONE: 0 },
}));

const mockFetchRockData = vi.mocked(fetchRockData);
const mockPostRockData = vi.mocked(postRockData);

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
    mockPostRockData.mockReset();
  });

  it('returns invalid-id for missing or malformed token values', async () => {
    const missing = await loader(createArgs());
    const invalid = await loader(createArgs('?rckpid=%7B%7Bbad%7D%7D'));

    expect(readData(missing)).toEqual({
      status: 'invalid-id',
      debug: {
        detectedParam: null,
        tokenPresent: false,
        tokenLength: 0,
        tokenFingerprint: null,
        validationPassed: false,
      },
    });
    expect(readData(invalid)).toEqual({
      status: 'invalid-id',
      debug: {
        detectedParam: 'rckpid',
        tokenPresent: true,
        tokenLength: 7,
        tokenFingerprint: 'e2605a3cad12',
        validationPassed: false,
      },
    });
    expect(mockFetchRockData).not.toHaveBeenCalled();
    expect(mockPostRockData).not.toHaveBeenCalled();
  });

  it('returns not-found when Lava does not return a person', async () => {
    mockPostRockData.mockResolvedValueOnce(null);

    const response = await loader(createArgs('?rckpid=token-123'));

    expect(readData(response)).toEqual({
      status: 'not-found',
      debug: {
        detectedParam: 'rckpid',
        tokenPresent: true,
        tokenLength: 9,
        tokenFingerprint: '034192845dc4',
        validationPassed: true,
        decodeAttempted: true,
        personResolved: false,
      },
    });
    expect(mockPostRockData).toHaveBeenCalledWith({
      endpoint: '/Lava/RenderTemplate',
      body:
        '{% assign person = "token-123" | PersonTokenRead %}{{ person | ToJSON }}',
      contentType: 'text/plain',
    });
    expect(mockFetchRockData).not.toHaveBeenCalled();
  });

  it('accepts the mobile app rckpid alias', async () => {
    mockPostRockData.mockResolvedValueOnce({
      id: 123,
      firstName: 'Jane',
      primaryCampusId: 10,
    });
    mockFetchRockData
      .mockResolvedValueOnce({
        numberFormatted: '555-123-4567',
      })
      .mockResolvedValueOnce([{ id: 10, guid: 'campus-guid' }]);

    const response = await loader(createArgs('?rckpid=token-123'));

    expect(readData(response)).toEqual({
      status: 'success',
      prefill: {
        firstName: 'Jane',
        phone: '555-123-4567',
        campus: 'campus-guid',
      },
      debug: {
        detectedParam: 'rckpid',
        tokenPresent: true,
        tokenLength: 9,
        tokenFingerprint: '034192845dc4',
        validationPassed: true,
        decodeAttempted: true,
        personResolved: true,
        personId: '123',
        hasFirstName: true,
        hasLastName: false,
        hasEmail: false,
        hasPhone: true,
        hasCampus: true,
      },
    });
    expect(mockPostRockData).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        endpoint: '/Lava/RenderTemplate',
      }),
    );
  });

  it('maps Rock person, phone, and campus data to a minimal prefill response', async () => {
    mockPostRockData.mockResolvedValueOnce({
      id: 123,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      primaryCampusId: 10,
      recordStatusValueId: 3,
    });
    mockFetchRockData
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

    const response = await loader(createArgs('?rckipid=token-123'));

    expect(readData(response)).toEqual({
      status: 'success',
      prefill: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-123-4567',
        campus: 'campus-guid',
      },
      debug: {
        detectedParam: 'rckipid',
        tokenPresent: true,
        tokenLength: 9,
        tokenFingerprint: '034192845dc4',
        validationPassed: true,
        decodeAttempted: true,
        personResolved: true,
        personId: '123',
        hasFirstName: true,
        hasLastName: true,
        hasEmail: true,
        hasPhone: true,
        hasCampus: true,
      },
    });
    expect(mockFetchRockData).toHaveBeenNthCalledWith(1, {
      endpoint: 'PhoneNumbers',
      queryParams: {
        $filter: 'PersonId eq 123',
        $select: 'Number,NumberFormatted',
      },
      ttl: 0,
    });
    expect(mockFetchRockData).toHaveBeenNthCalledWith(2, {
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
    mockPostRockData.mockResolvedValueOnce({
      id: 123,
      firstName: 'Jane',
      primaryCampus: { guid: 'direct-campus-guid' },
    });
    mockFetchRockData
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const response = await loader(createArgs('?rckipid=token-123'));

    expect(readData(response)).toEqual({
      status: 'success',
      prefill: {
        firstName: 'Jane',
        campus: 'direct-campus-guid',
      },
      debug: {
        detectedParam: 'rckipid',
        tokenPresent: true,
        tokenLength: 9,
        tokenFingerprint: '034192845dc4',
        validationPassed: true,
        decodeAttempted: true,
        personResolved: true,
        personId: '123',
        hasFirstName: true,
        hasLastName: false,
        hasEmail: false,
        hasPhone: false,
        hasCampus: true,
      },
    });
  });

  it('returns error when a Rock request fails', async () => {
    mockPostRockData.mockRejectedValueOnce(new Error('Rock unavailable'));

    const response = await loader(createArgs('?rckipid=token-123'));

    expect(readStatus(response)).toBe(500);
    expect(readData(response)).toEqual({
      status: 'error',
      message: 'Unable to load prefill data',
      debug: {
        detectedParam: 'rckipid',
        tokenPresent: true,
        tokenLength: 9,
        tokenFingerprint: '034192845dc4',
        validationPassed: true,
        decodeAttempted: true,
      },
    });
  });
});
