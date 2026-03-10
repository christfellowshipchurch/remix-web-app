import { describe, it, expect } from "vitest";
import { generateMetaKeywords } from "../generate-meta-keywords";
import { DEFAULT_KEYWORDS } from "../meta-utils";

describe("generateMetaKeywords", () => {
  it("returns default keywords when no options provided", () => {
    expect(generateMetaKeywords({})).toBe(DEFAULT_KEYWORDS);
  });

  it("includes words from title", () => {
    const result = generateMetaKeywords({
      title: "Finding Hope in Hard Times",
      includeDefaults: false,
    });
    expect(result).toContain("finding");
    expect(result).toContain("hope");
  });

  it("includes category values", () => {
    const result = generateMetaKeywords({
      categories: ["Bible Study", "Prayer"],
      includeDefaults: false,
    });
    expect(result).toContain("Bible Study");
    expect(result).toContain("Prayer");
  });

  it("includes author name words", () => {
    const result = generateMetaKeywords({
      authorOrSpeaker: "Todd Mullins",
      includeDefaults: false,
    });
    expect(result).toContain("todd");
    expect(result).toContain("mullins");
  });

  it("includes series title words", () => {
    const result = generateMetaKeywords({
      seriesTitle: "The Journey",
      includeDefaults: false,
    });
    expect(result).toContain("journey");
  });

  it("adds sermon and message terms for message type", () => {
    const result = generateMetaKeywords({
      type: "message",
      includeDefaults: false,
    });
    expect(result).toContain("sermon");
    expect(result).toContain("message");
  });

  it("adds event term for event type", () => {
    const result = generateMetaKeywords({
      type: "event",
      includeDefaults: false,
    });
    expect(result).toContain("event");
  });

  it("adds article and blog terms for article type", () => {
    const result = generateMetaKeywords({
      type: "article",
      includeDefaults: false,
    });
    expect(result).toContain("article");
    expect(result).toContain("blog");
  });

  it("adds podcast term for podcast type", () => {
    const result = generateMetaKeywords({
      type: "podcast",
      includeDefaults: false,
    });
    expect(result).toContain("podcast");
  });

  it("appends default keywords by default", () => {
    const result = generateMetaKeywords({ title: "Test" });
    expect(result).toContain("church South Florida");
  });

  it("omits default keywords when includeDefaults is false", () => {
    const result = generateMetaKeywords({
      title: "Test",
      includeDefaults: false,
    });
    expect(result).not.toContain("church South Florida");
  });

  it("deduplicates terms", () => {
    const result = generateMetaKeywords({
      title: "event",
      type: "event",
      includeDefaults: false,
    });
    const terms = result.split(", ").filter((t) => t.toLowerCase() === "event");
    expect(terms.length).toBe(1);
  });

  it("limits content terms to MAX_CONTENT_TERMS (12)", () => {
    const result = generateMetaKeywords({
      title: "One Two Three Four Five Six",
      categories: ["Cat1", "Cat2", "Cat3", "Cat4"],
      authorOrSpeaker: "Author Name Here",
      seriesTitle: "Series Title Here",
      includeDefaults: false,
    });
    const terms = result.split(", ");
    expect(terms.length).toBeLessThanOrEqual(12);
  });

  it("filters short words (less than 2 chars)", () => {
    const result = generateMetaKeywords({
      title: "A Quick Test",
      includeDefaults: false,
    });
    // 'a' is only 1 char, should be excluded
    const terms = result.split(", ");
    expect(terms).not.toContain("a");
  });

  it("returns only defaults when all content fields are empty", () => {
    const result = generateMetaKeywords({
      title: "",
      categories: [],
      includeDefaults: true,
    });
    expect(result).toBe(DEFAULT_KEYWORDS);
  });
});
