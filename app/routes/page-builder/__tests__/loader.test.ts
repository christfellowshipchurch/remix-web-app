import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('~/lib/.server/fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
  isItemInDateRange: vi.fn(),
  TTL: {
    NONE: 0,
  },
}));

import { fetchRockData } from '~/lib/.server/fetch-rock-data';
import { fetchChildItems } from '../loader';

const mockFetchRockData = fetchRockData as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('fetchChildItems', () => {
  it('returns a flat array of fetched child items', async () => {
    const childItem = {
      id: '101',
      status: 2,
      title: 'Child Item',
      content: 'Child content',
      contentChannelId: '22',
    };

    mockFetchRockData
      .mockResolvedValueOnce([
        { childContentChannelItemId: '101' },
        { childContentChannelItemId: '102' },
      ])
      .mockResolvedValueOnce(childItem)
      .mockResolvedValueOnce([]);

    await expect(fetchChildItems('10')).resolves.toEqual([childItem]);
  });
});
