import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
}));

vi.mock('~/lib/utils', () => ({
  createImageUrlFromGuid: (guid: string) => `https://cdn.example.com/${guid}`,
}));

import { fetchRockData } from '../fetch-rock-data';
import { fetchAuthorArticles } from '../author-utils';

const mockFetch = fetchRockData as ReturnType<typeof vi.fn>;

/** Rock ContentChannelItem status: 1 = Pending, 2 = Approved, 3 = Denied. */
const APPROVED = 2;
const PENDING = 1;
const DENIED = 3;

const article = (title: string, status = APPROVED) => ({
  title,
  status,
  startDateTime: '2025-01-01T00:00:00',
  attributeValues: { url: { value: title } },
});

describe('fetchAuthorArticles', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // An author page must not advertise articles readers can no longer open, so
  // the feed has to be scoped to the live StartDateTime/ExpireDateTime window as
  // well as to approved content.
  it('requests only approved articles inside the live date range', async () => {
    mockFetch.mockResolvedValue([]);

    await fetchAuthorArticles('alias-guid');

    const options = mockFetch.mock.calls[0][0];
    expect(options.filterByDateRange).toBe(true);
    expect(options.queryParams.$filter).toContain("Status eq 'Approved'");
  });

  // Rock applies $top before the in-memory date-range filter. Requesting exactly
  // six would let expired articles consume slots, so the request over-fetches and
  // the helper trims — otherwise a page could show fewer than six live articles
  // while more were available.
  it('over-fetches so expired articles cannot shrink the feed', async () => {
    mockFetch.mockResolvedValue([]);

    await fetchAuthorArticles('alias-guid');

    expect(Number(mockFetch.mock.calls[0][0].queryParams.$top)).toBeGreaterThan(
      6,
    );
  });

  it('still caps the feed at six articles', async () => {
    mockFetch.mockResolvedValue(
      Array.from({ length: 12 }, (_, i) => article(`article-${i}`)),
    );

    const articles = await fetchAuthorArticles('alias-guid');

    expect(articles).toHaveLength(6);
    expect(articles[0].title).toBe('article-0');
  });

  it('returns every article when fewer than the cap are live', async () => {
    mockFetch.mockResolvedValue([article('one'), article('two')]);

    await expect(fetchAuthorArticles('alias-guid')).resolves.toHaveLength(2);
  });

  // fetchRockData collapses a single-item array — including one left by its own
  // date-range filter — into a bare object. Callers map over this result.
  it('wraps a lone article left after date filtering into an array', async () => {
    mockFetch.mockResolvedValue(article('only-live-one'));

    const articles = await fetchAuthorArticles('alias-guid');

    expect(articles).toEqual([article('only-live-one')]);
  });

  // applyDateRangeFilter returns [] when the single item it received is expired.
  it('returns an empty list when every article is out of date range', async () => {
    mockFetch.mockResolvedValue([]);

    await expect(fetchAuthorArticles('alias-guid')).resolves.toEqual([]);
  });

  it('returns an empty list when Rock returns nothing', async () => {
    mockFetch.mockResolvedValue(null);

    await expect(fetchAuthorArticles('alias-guid')).resolves.toEqual([]);
  });

  // Preview mode (SHOW_UNAPPROVED_CONTENT) strips the Status clause from the
  // query, so the request alone can't guarantee approval. An author page is a
  // public publication index — an article that was denied, or never approved,
  // must not appear on it in any environment.
  describe('approval is enforced even when the query filter was stripped', () => {
    it('drops denied articles', async () => {
      mockFetch.mockResolvedValue([
        article('approved-one'),
        article('was-approved-now-denied', DENIED),
      ]);

      const articles = await fetchAuthorArticles('alias-guid');

      expect(articles.map((a) => a.title)).toEqual(['approved-one']);
    });

    it('drops pending articles', async () => {
      mockFetch.mockResolvedValue([
        article('approved-one'),
        article('still-a-draft', PENDING),
      ]);

      const articles = await fetchAuthorArticles('alias-guid');

      expect(articles.map((a) => a.title)).toEqual(['approved-one']);
    });

    it('returns nothing when the author has no approved articles', async () => {
      mockFetch.mockResolvedValue([
        article('draft', PENDING),
        article('rejected', DENIED),
      ]);

      await expect(fetchAuthorArticles('alias-guid')).resolves.toEqual([]);
    });

    it('counts the cap against approved articles only', async () => {
      mockFetch.mockResolvedValue([
        ...Array.from({ length: 4 }, (_, i) => article(`denied-${i}`, DENIED)),
        ...Array.from({ length: 8 }, (_, i) => article(`approved-${i}`)),
      ]);

      const articles = await fetchAuthorArticles('alias-guid');

      expect(articles).toHaveLength(6);
      expect(articles.every((a) => a.status === APPROVED)).toBe(true);
    });
  });
});
