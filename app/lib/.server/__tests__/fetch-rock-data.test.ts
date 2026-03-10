import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchRockData,
  deleteRockData,
  postRockData,
  patchRockData,
  deleteCacheKey,
  isItemInDateRange,
} from "../fetch-rock-data";

// Mock redis to null so all tests bypass cache
vi.mock("../redis-config", () => ({ default: null }));

vi.mock("~/lib/utils", () => ({
  normalize: (data: unknown) => data,
}));

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ROCK_API = "https://rock.example.com/api/";
  process.env.ROCK_TOKEN = "test-token";
  global.fetch = vi.fn();
});

// ─── isItemInDateRange ──────────────────────────────────────────────────────

describe("isItemInDateRange", () => {
  const now = new Date("2025-06-15T12:00:00Z");

  it("returns true when no start or expire dates set", () => {
    expect(isItemInDateRange({}, now)).toBe(true);
  });

  it("returns false when now is before startDateTime", () => {
    expect(
      isItemInDateRange({ startDateTime: "2025-07-01T00:00:00Z" }, now)
    ).toBe(false);
  });

  it("returns true when now is after startDateTime", () => {
    expect(
      isItemInDateRange({ startDateTime: "2025-01-01T00:00:00Z" }, now)
    ).toBe(true);
  });

  it("returns false when now is after expireDateTime", () => {
    expect(
      isItemInDateRange({ expireDateTime: "2025-01-01T00:00:00Z" }, now)
    ).toBe(false);
  });

  it("returns true when now is before expireDateTime", () => {
    expect(
      isItemInDateRange({ expireDateTime: "2025-12-31T00:00:00Z" }, now)
    ).toBe(true);
  });

  it("supports PascalCase StartDateTime and ExpireDateTime", () => {
    expect(
      isItemInDateRange(
        {
          StartDateTime: "2025-01-01T00:00:00Z",
          ExpireDateTime: "2025-12-31T00:00:00Z",
        },
        now
      )
    ).toBe(true);
  });

  it("returns false when now is outside the date range", () => {
    expect(
      isItemInDateRange(
        {
          startDateTime: "2025-01-01T00:00:00Z",
          expireDateTime: "2025-05-01T00:00:00Z",
        },
        now
      )
    ).toBe(false);
  });
});

// ─── fetchRockData ──────────────────────────────────────────────────────────

describe("fetchRockData", () => {
  it("fetches from the correct URL with query params", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }, { id: 2 }],
    });

    await fetchRockData({ endpoint: "ContentChannelItems", queryParams: { $top: "10" } });

    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("ContentChannelItems");
    expect(calledUrl).toContain("%24top=10");
  });

  it("returns a single object when array has length 1", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 42 }],
    });

    const result = await fetchRockData({ endpoint: "People" });
    expect(result).toEqual({ id: 42 });
  });

  it("returns the full array when length > 1", async () => {
    const items = [{ id: 1 }, { id: 2 }];
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => items,
    });

    const result = await fetchRockData({ endpoint: "People" });
    expect(result).toEqual(items);
  });

  it("throws when response is not ok", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(fetchRockData({ endpoint: "People" })).rejects.toThrow(
      "⚠️ Error Fetching Rock Data"
    );
  });

  it("includes Content-Type application/json header", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchRockData({ endpoint: "People" });

    const headers = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]
      .headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("merges custom headers", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchRockData({
      endpoint: "People",
      customHeaders: { Cookie: "rock-session=abc" },
    });

    const headers = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]
      .headers as Record<string, string>;
    expect(headers["Cookie"]).toBe("rock-session=abc");
  });
});

// ─── deleteRockData ─────────────────────────────────────────────────────────

describe("deleteRockData", () => {
  it("returns response status on success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const status = await deleteRockData("People/1");
    expect(status).toBe(204);
  });

  it("throws when response is not ok", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(deleteRockData("People/99")).rejects.toThrow(
      "Failed to delete resource"
    );
  });
});

// ─── postRockData ───────────────────────────────────────────────────────────

describe("postRockData", () => {
  it("returns parsed JSON body on success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ id: 10 }),
    });

    const result = await postRockData({ endpoint: "People", body: { name: "Test" } });
    expect(result).toEqual({ id: 10 });
  });

  it("returns empty object when response body is empty", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      text: async () => "",
    });

    const result = await postRockData({ endpoint: "People", body: {} });
    expect(result).toEqual({});
  });

  it("throws when response is not ok", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(
      postRockData({ endpoint: "People", body: {} })
    ).rejects.toThrow("Failed to post data");
  });
});

// ─── patchRockData ──────────────────────────────────────────────────────────

describe("patchRockData", () => {
  it("returns response status on success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const status = await patchRockData({ endpoint: "People/1", body: { firstName: "John" } });
    expect(status).toBe(200);
  });

  it("throws when response is not ok", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Server Error",
    });

    await expect(
      patchRockData({ endpoint: "People/1", body: {} })
    ).rejects.toThrow("Failed to patch data");
  });
});

// ─── deleteCacheKey ─────────────────────────────────────────────────────────

describe("deleteCacheKey", () => {
  it("returns false when redis is null (no redis configured)", async () => {
    const result = await deleteCacheKey({ endpoint: "People", queryParams: { $top: "10" } });
    expect(result).toBe(false);
  });
});
