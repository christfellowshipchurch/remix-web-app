import { describe, it, expect, vi, beforeEach } from "vitest";
import { attributeIsImage, getImages, getAttributeMatrixItems } from "../rock-utils";

vi.mock("../fetch-rock-data", () => ({
  fetchRockData: vi.fn(),
}));

vi.mock("~/lib/utils", () => ({
  createImageUrlFromGuid: (guid: string) => `https://cdn.example.com/${guid}`,
}));

import { fetchRockData } from "../fetch-rock-data";

const mockFetch = fetchRockData as ReturnType<typeof vi.fn>;

describe("attributeIsImage", () => {
  const attributeValues = {
    coverImage: { value: "some-guid" },
    title: { value: "Some Title" },
    backgroundImageUrl: { value: "another-guid" },
    count: { value: 5 as unknown as string },
  };

  it("returns true when key contains 'image' and value is a string", () => {
    expect(attributeIsImage({ key: "coverImage", attributeValues })).toBe(true);
  });

  it("returns true for keys like 'backgroundImageUrl'", () => {
    expect(
      attributeIsImage({ key: "backgroundImageUrl", attributeValues })
    ).toBe(true);
  });

  it("returns false when key does not contain 'image'", () => {
    expect(attributeIsImage({ key: "title", attributeValues })).toBe(false);
  });

  it("returns false when value is not a string", () => {
    expect(attributeIsImage({ key: "count", attributeValues })).toBe(false);
  });

  it("is case-insensitive on the key", () => {
    const av = { Image: { value: "guid-x" } };
    expect(attributeIsImage({ key: "Image", attributeValues: av })).toBe(true);
  });
});

describe("getImages", () => {
  it("returns transformed image URLs for image keys", () => {
    const attributes = {
      coverImage: {},
      title: {},
    };
    const attributeValues = {
      coverImage: { value: "guid-123" },
      title: { value: "Hello" },
    };
    const result = getImages({
      attributeValues: attributeValues as Parameters<typeof getImages>[0]["attributeValues"],
      attributes: attributes as Parameters<typeof getImages>[0]["attributes"],
    });
    expect(result).toEqual(["https://cdn.example.com/guid-123"]);
  });

  it("returns empty array when no image keys exist", () => {
    const attributes = { title: {}, count: {} };
    const attributeValues = {
      title: { value: "Hello" },
      count: { value: "5" },
    };
    const result = getImages({
      attributeValues: attributeValues as Parameters<typeof getImages>[0]["attributeValues"],
      attributes: attributes as Parameters<typeof getImages>[0]["attributes"],
    });
    expect(result).toEqual([]);
  });
});

describe("getAttributeMatrixItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns [] when attributeMatrix is null/undefined", async () => {
    mockFetch.mockResolvedValueOnce(null);
    const result = await getAttributeMatrixItems({
      attributeMatrixGuid: "guid-1",
    });
    expect(result).toEqual([]);
  });

  it("returns [] when matrixItems is empty", async () => {
    mockFetch.mockResolvedValueOnce({ attributeMatrixItems: [] });
    const result = await getAttributeMatrixItems({
      attributeMatrixGuid: "guid-1",
    });
    expect(result).toEqual([]);
  });

  it("returns expanded items as array when fetchRockData returns array", async () => {
    const matrixItems = [{ id: 1 }, { id: 2 }];
    const expandedItems = [
      { id: 1, attributeValues: {} },
      { id: 2, attributeValues: {} },
    ];
    mockFetch
      .mockResolvedValueOnce({ attributeMatrixItems: matrixItems })
      .mockResolvedValueOnce(expandedItems);

    const result = await getAttributeMatrixItems({
      attributeMatrixGuid: "guid-2",
    });
    expect(result).toEqual(expandedItems);
  });

  it("wraps a single expanded item in an array", async () => {
    const singleItem = { id: 1, attributeValues: {} };
    mockFetch
      .mockResolvedValueOnce({ attributeMatrixItems: [{ id: 1 }] })
      .mockResolvedValueOnce(singleItem);

    const result = await getAttributeMatrixItems({
      attributeMatrixGuid: "guid-3",
    });
    expect(result).toEqual([singleItem]);
  });

  it("returns [] when expanded items is null", async () => {
    mockFetch
      .mockResolvedValueOnce({ attributeMatrixItems: [{ id: 1 }] })
      .mockResolvedValueOnce(null);

    const result = await getAttributeMatrixItems({
      attributeMatrixGuid: "guid-4",
    });
    expect(result).toEqual([]);
  });

  it("returns [] when fetchRockData throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));
    const result = await getAttributeMatrixItems({
      attributeMatrixGuid: "guid-5",
    });
    expect(result).toEqual([]);
  });
});
