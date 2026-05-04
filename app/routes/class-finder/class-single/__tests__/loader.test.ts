import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "../loader";

vi.mock("~/lib/.server/fetch-rock-data", () => ({
  fetchRockData: vi.fn(),
}));

vi.mock("~/lib/.server/error-types", () => ({
  AuthenticationError: class AuthenticationError extends Error {},
}));

import { fetchRockData } from "~/lib/.server/fetch-rock-data";

const mockFetchRockData = fetchRockData as ReturnType<typeof vi.fn>;

function makeParams(path: string) {
  return {
    params: { path },
    request: new Request("http://localhost/"),
    context: {},
  } as unknown as Parameters<typeof loader>[0];
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ALGOLIA_APP_ID = "test-app-id";
  process.env.ALGOLIA_SEARCH_API_KEY = "test-search-key";
});

describe("class-single loader — onDemandUrl", () => {
  it("returns onDemandUrl when Rock has a value for onDemandSignUpLink", async () => {
    mockFetchRockData.mockResolvedValueOnce({
      attributeValues: {
        discussionGuide: { value: "" },
        classTrailer: { value: "" },
        onDemandSignUpLink: { value: "  https://example.com/on-demand  " },
      },
    });

    const result = await loader(makeParams("some-class"));

    expect(result.onDemandUrl).toBe("https://example.com/on-demand");
  });

  it("returns empty string when Rock onDemandSignUpLink is blank", async () => {
    mockFetchRockData.mockResolvedValueOnce({
      attributeValues: {
        discussionGuide: { value: "" },
        classTrailer: { value: "" },
        onDemandSignUpLink: { value: "   " },
      },
    });

    const result = await loader(makeParams("some-class"));

    expect(result.onDemandUrl).toBe("");
  });

  it("returns empty string when Rock onDemandSignUpLink is missing", async () => {
    mockFetchRockData.mockResolvedValueOnce({
      attributeValues: {
        discussionGuide: { value: "" },
        classTrailer: { value: "" },
      },
    });

    const result = await loader(makeParams("some-class"));

    expect(result.onDemandUrl).toBe("");
  });

  it("returns empty string when Rock fetch returns undefined", async () => {
    mockFetchRockData.mockResolvedValueOnce(undefined);

    const result = await loader(makeParams("some-class"));

    expect(result.onDemandUrl).toBe("");
  });

  it("returns empty string when Rock fetch throws", async () => {
    mockFetchRockData.mockRejectedValueOnce(new Error("network error"));

    const result = await loader(makeParams("some-class"));

    expect(result.onDemandUrl).toBe("");
  });
});
