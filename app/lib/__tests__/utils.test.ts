import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  cn,
  normalize,
  fieldsAsObject,
  enforceProtocol,
  createImageUrlFromGuid,
  getIdentifierType,
  shareMessaging,
  isAppleDevice,
  isValidZip,
  latLonDistance,
  getFirstParagraph,
  parseRockKeyValueList,
  parseRockValueList,
  formattedServiceTimes,
  ensureArray,
  getImageUrl,
  calculateReadTime,
} from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const includeBar = false;
    expect(cn("foo", includeBar && "bar", "baz")).toBe("foo baz");
  });

  it("merges conflicting tailwind classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});

describe("normalize", () => {
  it("converts PascalCase keys to camelCase", () => {
    const result = normalize({ FirstName: "John", LastName: "Doe" });
    expect(result).toEqual({ firstName: "John", lastName: "Doe" });
  });

  it("handles nested objects", () => {
    const result = normalize({ Person: { FirstName: "John" } });
    expect(result).toEqual({ person: { firstName: "John" } });
  });

  it("handles arrays", () => {
    const result = normalize([{ FirstName: "John" }, { FirstName: "Jane" }]);
    expect(result).toEqual([{ firstName: "John" }, { firstName: "Jane" }]);
  });

  it("returns null unchanged", () => {
    expect(normalize(null as unknown as object)).toBeNull();
  });

  it("returns primitives unchanged", () => {
    expect(normalize("hello" as unknown as object)).toBe("hello");
  });
});

describe("fieldsAsObject", () => {
  it("converts field/value array to object", () => {
    const result = fieldsAsObject([
      { field: "name", value: "John" },
      { field: "age", value: 30 },
    ]);
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("trims string values", () => {
    const result = fieldsAsObject([{ field: "name", value: "  John  " }]);
    expect(result).toEqual({ name: "John" });
  });

  it("does not trim non-string values", () => {
    const result = fieldsAsObject([{ field: "count", value: 42 }]);
    expect(result).toEqual({ count: 42 });
  });

  it("returns empty object for empty array", () => {
    expect(fieldsAsObject([])).toEqual({});
  });
});

describe("enforceProtocol", () => {
  it("prepends https: to protocol-relative URLs", () => {
    expect(enforceProtocol("//example.com/img.jpg")).toBe(
      "https://example.com/img.jpg"
    );
  });

  it("returns URLs with protocol unchanged", () => {
    expect(enforceProtocol("https://example.com")).toBe("https://example.com");
  });

  it("handles undefined gracefully", () => {
    expect(enforceProtocol(undefined as unknown as string)).toBeUndefined();
  });
});

describe("createImageUrlFromGuid", () => {
  beforeEach(() => {
    vi.stubEnv("CLOUDFRONT", "https://cdn.example.com");
  });

  it("creates CloudFront URL for a valid GUID (5 segments)", () => {
    const guid = "abc12345-1234-1234-1234-123456789abc";
    expect(createImageUrlFromGuid(guid)).toBe(
      "https://cdn.example.com/GetImage.ashx?guid=abc12345-1234-1234-1234-123456789abc"
    );
  });

  it("enforces protocol for protocol-relative non-GUID URLs", () => {
    expect(createImageUrlFromGuid("//example.com/img.jpg")).toBe(
      "https://example.com/img.jpg"
    );
  });

  it("returns absolute URL unchanged", () => {
    expect(createImageUrlFromGuid("https://example.com/img.jpg")).toBe(
      "https://example.com/img.jpg"
    );
  });

  it("handles undefined gracefully", () => {
    expect(createImageUrlFromGuid(undefined as unknown as string)).toBeUndefined();
  });
});

describe("getIdentifierType", () => {
  it("detects GUID", () => {
    const result = getIdentifierType("abc12345-1234-1234-9234-123456789abc");
    expect(result.type).toBe("guid");
    expect(result.query).toContain("Guid eq");
  });

  it("detects integer string", () => {
    const result = getIdentifierType("12345");
    expect(result.type).toBe("int");
    expect(result.query).toBe("Id eq 12345");
  });

  it("detects integer from number input", () => {
    const result = getIdentifierType(42);
    expect(result.type).toBe("int");
  });

  it("returns custom for non-GUID non-int strings", () => {
    const result = getIdentifierType("some-slug");
    expect(result.type).toBe("custom");
    expect(result.query).toBeNull();
  });
});

describe("shareMessaging", () => {
  it("returns default messages with title and url", () => {
    const result = shareMessaging({
      title: "Test Article",
      url: "https://example.com/article",
      shareMessages: {
        faceBook: "Check out this article from Christ Fellowship Church!",
        twitter: "Test Article at Christ Fellowship Church",
        email: {
          subject: "Test Article - Christ Fellowship Church",
          body: "I thought you might be interested in this article from Christ Fellowship: https://example.com/article \n\n",
        },
        sms: "I thought you might be interested in this article from Christ Fellowship: https://example.com/article",
      },
    });
    expect(result.title).toBe("Test Article");
    expect(result.faceBook).toContain("Christ Fellowship");
    expect(result.sms).toContain("https://example.com/article");
    expect(result.email.subject).toContain("Test Article");
  });

  it("merges custom share messages over defaults", () => {
    const result = shareMessaging({
      title: "Test",
      url: "https://example.com",
      shareMessages: {
        faceBook: "Custom FB message",
        twitter: "Test at Christ Fellowship Church",
        email: {
          subject: "Test - Christ Fellowship Church",
          body: "I thought you might be interested in this article from Christ Fellowship: https://example.com \n\n",
        },
        sms: "I thought you might be interested in this article from Christ Fellowship: https://example.com",
      },
    });
    expect(result.faceBook).toBe("Custom FB message");
    expect(result.twitter).toContain("Test");
  });
});

describe("isAppleDevice", () => {
  it("returns false for Windows user agent", () => {
    Object.defineProperty(window, "navigator", {
      value: { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      writable: true,
      configurable: true,
    });
    expect(isAppleDevice()).toBe(false);
  });

  it("returns true for iPhone user agent", () => {
    Object.defineProperty(window, "navigator", {
      value: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)" },
      writable: true,
      configurable: true,
    });
    expect(isAppleDevice()).toBe(true);
  });

  it("returns true for iPad user agent", () => {
    Object.defineProperty(window, "navigator", {
      value: { userAgent: "Mozilla/5.0 (iPad; CPU OS 16_0)" },
      writable: true,
      configurable: true,
    });
    expect(isAppleDevice()).toBe(true);
  });

  it("returns true for macOS user agent", () => {
    Object.defineProperty(window, "navigator", {
      value: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
      writable: true,
      configurable: true,
    });
    expect(isAppleDevice()).toBe(true);
  });
});

describe("isValidZip", () => {
  it("validates 5-digit ZIP codes", () => {
    expect(isValidZip("33401")).toBe(true);
    expect(isValidZip("00000")).toBe(true);
  });

  it("validates ZIP+4 codes", () => {
    expect(isValidZip("33401-1234")).toBe(true);
  });

  it("rejects 4-digit codes", () => {
    expect(isValidZip("1234")).toBe(false);
  });

  it("rejects 6-digit codes", () => {
    expect(isValidZip("123456")).toBe(false);
  });

  it("rejects alphabetic input", () => {
    expect(isValidZip("abcde")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidZip("")).toBe(false);
  });

  it("rejects partial ZIP+4 (too short extension)", () => {
    expect(isValidZip("33401-12")).toBe(false);
  });
});

describe("latLonDistance", () => {
  it("returns 0 for identical coordinates", () => {
    expect(latLonDistance(26.8, -80.1, 26.8, -80.1)).toBe(0);
  });

  it("calculates distance in miles between two points", () => {
    // Palm Beach Gardens to Fort Lauderdale ≈ ~48 miles as the crow flies
    const distance = latLonDistance(26.8235, -80.1387, 26.1224, -80.1373);
    expect(distance).toBeGreaterThan(40);
    expect(distance).toBeLessThan(60);
  });
});

describe("getFirstParagraph", () => {
  it("extracts text from first <p> tag", () => {
    const html = "<p>First paragraph</p><p>Second paragraph</p>";
    expect(getFirstParagraph(html)).toBe("First paragraph");
  });

  it("strips nested HTML tags from first paragraph", () => {
    const html = "<p>Hello <strong>world</strong></p>";
    expect(getFirstParagraph(html)).toBe("Hello world");
  });

  it("returns empty string when no <p> tag exists", () => {
    expect(getFirstParagraph("<div>No paragraphs</div>")).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(getFirstParagraph("")).toBe("");
  });
});

describe("parseRockKeyValueList", () => {
  it("parses key^value|key^value format", () => {
    const result = parseRockKeyValueList("Learn More^/learn|Sign Up^/signup");
    expect(result).toEqual([
      { key: "Learn More", value: "/learn" },
      { key: "Sign Up", value: "/signup" },
    ]);
  });

  it("decodes URL-encoded keys", () => {
    const result = parseRockKeyValueList("Learn%20More^/learn");
    expect(result).toEqual([{ key: "Learn More", value: "/learn" }]);
  });

  it("returns empty array for empty string", () => {
    expect(parseRockKeyValueList("")).toEqual([]);
  });

  it("returns empty array for null input", () => {
    expect(parseRockKeyValueList(null as unknown as string)).toEqual([]);
  });
});

describe("parseRockValueList", () => {
  it("parses pipe-separated values", () => {
    expect(parseRockValueList("alpha|beta|gamma")).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
  });

  it("trims whitespace from values", () => {
    expect(parseRockValueList(" alpha | beta ")).toEqual(["alpha", "beta"]);
  });

  it("filters out empty entries from trailing pipes", () => {
    expect(parseRockValueList("alpha|beta|")).toEqual(["alpha", "beta"]);
  });

  it("returns empty array for empty string", () => {
    expect(parseRockValueList("")).toEqual([]);
  });

  it("returns empty array for whitespace-only input", () => {
    expect(parseRockValueList("   ")).toEqual([]);
  });

  it("returns empty array for null input", () => {
    expect(parseRockValueList(null as unknown as string)).toEqual([]);
  });
});

describe("formattedServiceTimes", () => {
  it("groups times by day", () => {
    const result = formattedServiceTimes(
      "Sunday^9:00 AM|Sunday^11:00 AM|Saturday^6:00 PM"
    );
    expect(result).toEqual([
      { day: "Sunday", hour: ["9:00 AM", "11:00 AM"] },
      { day: "Saturday", hour: ["6:00 PM"] },
    ]);
  });

  it("handles single entry", () => {
    const result = formattedServiceTimes("Sunday^10:00 AM");
    expect(result).toEqual([{ day: "Sunday", hour: ["10:00 AM"] }]);
  });

  it("drops OnDemand segments (e.g. online campus trailing OnDemand^)", () => {
    const result = formattedServiceTimes(
      "Sunday^8:15AM|Sunday^9:45AM|Sunday^11:30AM|OnDemand^",
    );
    expect(result).toEqual([
      { day: "Sunday", hour: ["8:15AM", "9:45AM", "11:30AM"] },
    ]);
  });

  it("drops OnDemand case-insensitively", () => {
    expect(
      formattedServiceTimes("Sunday^9:00 AM|ONDEMAND^|Saturday^5:00 PM"),
    ).toEqual([
      { day: "Sunday", hour: ["9:00 AM"] },
      { day: "Saturday", hour: ["5:00 PM"] },
    ]);
  });
});

describe("ensureArray", () => {
  it("wraps a string in an array", () => {
    expect(ensureArray("hello")).toEqual(["hello"]);
  });

  it("wraps a number in an array", () => {
    expect(ensureArray(42)).toEqual([42]);
  });

  it("returns an existing array unchanged", () => {
    expect(ensureArray([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe("getImageUrl", () => {
  it("builds correct CloudFront URL from id", () => {
    expect(getImageUrl("123")).toBe(
      "https://cloudfront.christfellowship.church/GetImage.ashx?id=123"
    );
  });
});

describe("calculateReadTime", () => {
  it("returns 1 for very short content", () => {
    expect(calculateReadTime("short")).toBe(1);
  });

  it("calculates read time at 200 wpm", () => {
    const words = new Array(400).fill("word").join(" ");
    expect(calculateReadTime(words)).toBe(2);
  });

  it("rounds to nearest minute", () => {
    const words = new Array(500).fill("word").join(" ");
    // 500 / 200 = 2.5 → Math.round → 3
    expect(calculateReadTime(words)).toBe(3);
  });

  it("handles undefined gracefully", () => {
    expect(calculateReadTime(undefined as unknown as string)).toBe(1);
  });
});
