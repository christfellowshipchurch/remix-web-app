# Unit Testing Execution Guide

> For use by Claude Sonnet (or any implementer). Follow each priority module in order.
> Run `pnpm test` after completing each module to verify all tests pass.

---

## Prerequisites

The project already has Vitest + React Testing Library configured:

- `vitest.config.ts` — jsdom env, globals enabled, setup file
- `vitest.setup.ts` — mocks for matchMedia, ResizeObserver, IntersectionObserver
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` installed
- Test scripts: `pnpm test`, `pnpm test:coverage`, `pnpm test:watch`

**Conventions (follow the 5 existing tests as reference):**
- Test files go in `__tests__/index.test.tsx` (or `.test.ts`) next to the module
- Use `describe("ComponentName", () => { ... })` blocks
- Use `it("verb + behavior", () => { ... })` for test cases
- Import from vitest: `describe, it, expect, vi, beforeEach`
- Wrap components needing router in `<MemoryRouter>`

---

## Priority 0: Test Utilities Setup

### File: `app/test-utils/render.tsx`

Create a custom render wrapper that provides all context providers.

```tsx
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement } from "react";

type CustomRenderOptions = RenderOptions & {
  route?: string;
};

export function renderWithRouter(
  ui: ReactElement,
  { route = "/", ...options }: CustomRenderOptions = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>,
    options
  );
}

export { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
```

### File: `app/test-utils/fixtures/person.ts`

```ts
import type { User } from "~/providers/auth-provider";

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: "1",
    fullName: "Test User",
    email: "test@example.com",
    phoneNumber: "5551234567",
    guid: "abc12345-1234-1234-1234-123456789abc",
    gender: "Male",
    birthDate: "1990-01-01",
    photo: "/test-photo.jpg",
    ...overrides,
  };
}
```

### File: `app/test-utils/fixtures/group.ts`

```ts
export function createMockGroup(overrides = {}) {
  return {
    objectID: "group-1",
    title: "Test Group",
    description: "A test group description",
    coverImage: { sources: [{ uri: "/test-group-image.jpg" }] },
    meetingDays: "Monday",
    meetingTime: "7:00 PM",
    minAge: 18,
    maxAge: 30,
    campusName: "Palm Beach Gardens",
    groupFor: "Adults",
    ...overrides,
  };
}
```

**Coverage goal:** N/A — infrastructure only.

---

## Priority 1: `app/lib/utils.ts`

### File: `app/lib/__tests__/utils.test.ts`

This file has ~20 pure functions. Test every exported function.

**Mocking requirements:**
- Mock `process.env.CLOUDFRONT` for `createImageUrlFromGuid`
- No component rendering needed — pure TypeScript tests

```ts
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
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("merges conflicting tailwind classes", () => {
    // twMerge should resolve conflicts — later class wins
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

  it("returns primitives unchanged", () => {
    expect(normalize(null as unknown as object)).toBeNull();
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
});

describe("enforceProtocol", () => {
  it("prepends https: to protocol-relative URLs", () => {
    expect(enforceProtocol("//example.com/img.jpg")).toBe("https://example.com/img.jpg");
  });

  it("returns URLs with protocol unchanged", () => {
    expect(enforceProtocol("https://example.com")).toBe("https://example.com");
  });

  it("handles undefined/null gracefully", () => {
    expect(enforceProtocol(undefined as unknown as string)).toBeUndefined();
  });
});

describe("createImageUrlFromGuid", () => {
  beforeEach(() => {
    vi.stubEnv("CLOUDFRONT", "https://cdn.example.com");
  });

  it("creates CloudFront URL for a valid GUID", () => {
    const guid = "abc12345-1234-1234-1234-123456789abc";
    expect(createImageUrlFromGuid(guid)).toBe(
      "https://cdn.example.com/GetImage.ashx?guid=abc12345-1234-1234-1234-123456789abc"
    );
  });

  it("enforces protocol for non-GUID URLs", () => {
    expect(createImageUrlFromGuid("//example.com/img.jpg")).toBe("https://example.com/img.jpg");
  });

  it("returns full URL unchanged", () => {
    expect(createImageUrlFromGuid("https://example.com/img.jpg")).toBe("https://example.com/img.jpg");
  });
});

describe("getIdentifierType", () => {
  it("detects GUID", () => {
    const result = getIdentifierType("abc12345-1234-1234-9234-123456789abc");
    expect(result.type).toBe("guid");
    expect(result.query).toContain("Guid eq");
  });

  it("detects integer", () => {
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
      shareMessages: { faceBook: "Custom FB message" },
    });
    expect(result.faceBook).toBe("Custom FB message");
    // Other defaults should remain
    expect(result.twitter).toContain("Test");
  });
});

describe("isAppleDevice", () => {
  it("returns false on server (no window)", () => {
    // jsdom provides window, so we need to mock userAgent
    const originalNavigator = window.navigator;
    Object.defineProperty(window, "navigator", {
      value: { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      writable: true,
    });
    expect(isAppleDevice()).toBe(false);
    Object.defineProperty(window, "navigator", { value: originalNavigator, writable: true });
  });

  it("returns true for iPhone user agent", () => {
    Object.defineProperty(window, "navigator", {
      value: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)" },
      writable: true,
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

  it("rejects invalid ZIP codes", () => {
    expect(isValidZip("1234")).toBe(false);
    expect(isValidZip("abcde")).toBe(false);
    expect(isValidZip("")).toBe(false);
    expect(isValidZip("123456")).toBe(false);
    expect(isValidZip("33401-12")).toBe(false);
  });
});

describe("latLonDistance", () => {
  it("returns 0 for identical coordinates", () => {
    expect(latLonDistance(26.8, -80.1, 26.8, -80.1)).toBe(0);
  });

  it("calculates distance in miles between two points", () => {
    // Palm Beach Gardens to Fort Lauderdale ≈ ~65 miles
    const distance = latLonDistance(26.8235, -80.1387, 26.1224, -80.1373);
    expect(distance).toBeGreaterThan(40);
    expect(distance).toBeLessThan(60);
  });
});

describe("getFirstParagraph", () => {
  it("extracts text from first <p> tag (server-side regex)", () => {
    const html = "<p>First paragraph</p><p>Second paragraph</p>";
    expect(getFirstParagraph(html)).toBe("First paragraph");
  });

  it("strips nested HTML tags from first paragraph", () => {
    const html = "<p>Hello <strong>world</strong></p>";
    // Server-side uses regex which strips inner tags
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

  it("returns empty array for empty or falsy input", () => {
    expect(parseRockKeyValueList("")).toEqual([]);
    expect(parseRockKeyValueList(null as unknown as string)).toEqual([]);
  });
});

describe("parseRockValueList", () => {
  it("parses pipe-separated values", () => {
    expect(parseRockValueList("alpha|beta|gamma")).toEqual(["alpha", "beta", "gamma"]);
  });

  it("trims whitespace from values", () => {
    expect(parseRockValueList(" alpha | beta ")).toEqual(["alpha", "beta"]);
  });

  it("filters out empty entries from trailing pipes", () => {
    expect(parseRockValueList("alpha|beta|")).toEqual(["alpha", "beta"]);
  });

  it("returns empty array for empty/null/whitespace input", () => {
    expect(parseRockValueList("")).toEqual([]);
    expect(parseRockValueList("   ")).toEqual([]);
    expect(parseRockValueList(null as unknown as string)).toEqual([]);
  });
});

describe("formattedServiceTimes", () => {
  it("groups times by day", () => {
    const result = formattedServiceTimes("Sunday^9:00 AM|Sunday^11:00 AM|Saturday^6:00 PM");
    expect(result).toEqual([
      { day: "Sunday", hour: ["9:00 AM", "11:00 AM"] },
      { day: "Saturday", hour: ["6:00 PM"] },
    ]);
  });

  it("handles single entry", () => {
    const result = formattedServiceTimes("Sunday^10:00 AM");
    expect(result).toEqual([{ day: "Sunday", hour: ["10:00 AM"] }]);
  });
});

describe("ensureArray", () => {
  it("wraps non-array in array", () => {
    expect(ensureArray("hello")).toEqual(["hello"]);
    expect(ensureArray(42)).toEqual([42]);
  });

  it("returns array unchanged", () => {
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
    expect(calculateReadTime(words)).toBe(3); // 500/200 = 2.5, rounds to 3
  });

  it("handles undefined/null gracefully", () => {
    expect(calculateReadTime(undefined as unknown as string)).toBe(1);
  });
});
```

**Edge cases to cover:**
- `normalize`: null, arrays, nested objects, primitives passed in
- `createImageUrlFromGuid`: GUID vs non-GUID, protocol-relative URLs, undefined
- `getIdentifierType`: GUID, integer, number type, string slug
- `isValidZip`: boundary lengths (4, 5, 6 digits), ZIP+4, letters
- `latLonDistance`: same point (0), known city distances
- `parseRockKeyValueList` / `parseRockValueList`: empty, null, trailing pipes, URL encoding

**Coverage goal:** 90% lines, 85% branches.

---

## Priority 2: `app/lib/meta-utils.ts`

### File: `app/lib/__tests__/meta-utils.test.ts`

**Mocking requirements:**
- Mock `window.location.origin` or `import.meta.env.VITE_PUBLIC_ORIGIN` for URL generation

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMeta,
  SITE_NAME,
  DEFAULT_META_IMAGE,
  DEFAULT_KEYWORDS,
  DEFAULT_GENERATOR,
} from "../meta-utils";

describe("createMeta", () => {
  it("appends site name to title when not already present", () => {
    const meta = createMeta({ title: "About", description: "About page" });
    const titleEntry = meta.find((m) => "title" in m);
    expect(titleEntry).toEqual({ title: `About | ${SITE_NAME}` });
  });

  it("does not double-append site name", () => {
    const meta = createMeta({
      title: `About | ${SITE_NAME}`,
      description: "About page",
    });
    const titleEntry = meta.find((m) => "title" in m);
    expect(titleEntry).toEqual({ title: `About | ${SITE_NAME}` });
  });

  it("includes description in meta and OG tags", () => {
    const meta = createMeta({ title: "Test", description: "Test description" });
    const descMeta = meta.find((m) => "name" in m && m.name === "description");
    const ogDesc = meta.find((m) => "property" in m && m.property === "og:description");
    expect(descMeta?.content).toBe("Test description");
    expect(ogDesc?.content).toBe("Test description");
  });

  it("uses default image when none provided", () => {
    const meta = createMeta({ title: "Test", description: "Test" });
    const ogImage = meta.find((m) => "property" in m && m.property === "og:image");
    expect(ogImage?.content).toContain(DEFAULT_META_IMAGE);
  });

  it("uses custom image when provided as absolute URL", () => {
    const meta = createMeta({
      title: "Test",
      description: "Test",
      image: "https://cdn.example.com/img.jpg",
    });
    const ogImage = meta.find((m) => "property" in m && m.property === "og:image");
    expect(ogImage?.content).toBe("https://cdn.example.com/img.jpg");
  });

  it("includes canonical link when path is provided", () => {
    const meta = createMeta({
      title: "Test",
      description: "Test",
      path: "/about",
    });
    const canonical = meta.find(
      (m) => "tagName" in m && m.tagName === "link" && m.rel === "canonical"
    );
    expect(canonical).toBeDefined();
    expect((canonical as { href: string }).href).toContain("/about");
  });

  it("sets noindex when noIndex is true", () => {
    const meta = createMeta({
      title: "Test",
      description: "Test",
      noIndex: true,
    });
    const robots = meta.find((m) => "name" in m && m.name === "robots");
    expect(robots?.content).toBe("noindex, nofollow");
  });

  it("sets index,follow by default", () => {
    const meta = createMeta({ title: "Test", description: "Test" });
    const robots = meta.find((m) => "name" in m && m.name === "robots");
    expect(robots?.content).toBe("index, follow");
  });

  it("uses default keywords when none provided", () => {
    const meta = createMeta({ title: "Test", description: "Test" });
    const keywords = meta.find((m) => "name" in m && m.name === "keywords");
    expect(keywords?.content).toBe(DEFAULT_KEYWORDS);
  });

  it("uses custom keywords when provided", () => {
    const meta = createMeta({
      title: "Test",
      description: "Test",
      keywords: "custom, keywords",
    });
    const keywords = meta.find((m) => "name" in m && m.name === "keywords");
    expect(keywords?.content).toBe("custom, keywords");
  });

  it("includes author meta when author is provided", () => {
    const meta = createMeta({
      title: "Test",
      description: "Test",
      author: "Jane Doe",
    });
    const authorMeta = meta.find((m) => "name" in m && m.name === "author");
    const articleAuthor = meta.find((m) => "property" in m && m.property === "article:author");
    expect(authorMeta?.content).toBe("Jane Doe");
    expect(articleAuthor?.content).toBe("Jane Doe");
  });

  it("does not include author tags when author is empty/whitespace", () => {
    const meta = createMeta({
      title: "Test",
      description: "Test",
      author: "   ",
    });
    const authorMeta = meta.find((m) => "name" in m && m.name === "author");
    expect(authorMeta).toBeUndefined();
  });

  it("uses default generator", () => {
    const meta = createMeta({ title: "Test", description: "Test" });
    const generator = meta.find((m) => "name" in m && m.name === "generator");
    expect(generator?.content).toBe(DEFAULT_GENERATOR);
  });

  it("includes license when provided", () => {
    const meta = createMeta({
      title: "Test",
      description: "Test",
      license: "MIT",
    });
    const license = meta.find((m) => "name" in m && m.name === "license");
    expect(license?.content).toBe("MIT");
  });

  it("includes twitter card tags", () => {
    const meta = createMeta({ title: "Test", description: "Test desc" });
    const twitterCard = meta.find((m) => "name" in m && m.name === "twitter:card");
    const twitterTitle = meta.find((m) => "name" in m && m.name === "twitter:title");
    expect(twitterCard?.content).toBe("summary_large_image");
    expect(twitterTitle?.content).toContain("Test");
  });
});
```

**Edge cases to cover:**
- Title already contains site name
- Empty/whitespace author
- Path with and without leading slash
- Image as absolute URL vs relative path
- noIndex true vs false

**Coverage goal:** 90% lines, 85% branches.

---

## Priority 3: `app/lib/algolia-url-state.ts`

### File: `app/lib/__tests__/algolia-url-state.test.ts`

**Mocking requirements:** None — pure functions.

```ts
import { describe, it, expect } from "vitest";
import { createAlgoliaUrlStateConfig, type AlgoliaUrlStateBase } from "../algolia-url-state";

type TestState = AlgoliaUrlStateBase & {
  campus?: string;
  age?: string;
};

const config = createAlgoliaUrlStateConfig<TestState>({
  queryParamKey: "q",
  refinementAttributes: ["category", "day"],
  custom: {
    parse: (params) => ({
      campus: params.get("campus") ?? undefined,
      age: params.get("age") ?? undefined,
    }),
    toParams: (state, params) => {
      if (state.campus) params.set("campus", state.campus);
      if (state.age) params.set("age", state.age);
    },
  },
});

describe("createAlgoliaUrlStateConfig", () => {
  describe("parse", () => {
    it("parses query param", () => {
      const params = new URLSearchParams("q=hello");
      const state = config.parse(params);
      expect(state.query).toBe("hello");
    });

    it("parses refinement lists (multi-value)", () => {
      const params = new URLSearchParams("category=Bible&category=Prayer&day=Monday");
      const state = config.parse(params);
      expect(state.refinementList).toEqual({
        category: ["Bible", "Prayer"],
        day: ["Monday"],
      });
    });

    it("parses custom params", () => {
      const params = new URLSearchParams("campus=PBG&age=25");
      const state = config.parse(params);
      expect(state.campus).toBe("PBG");
      expect(state.age).toBe("25");
    });

    it("returns empty state for empty params", () => {
      const state = config.parse(new URLSearchParams());
      expect(state.query).toBeUndefined();
      expect(state.refinementList).toBeUndefined();
    });
  });

  describe("toParams", () => {
    it("serializes query", () => {
      const params = config.toParams({ query: "hello" });
      expect(params.get("q")).toBe("hello");
    });

    it("serializes refinement lists as repeated params", () => {
      const params = config.toParams({
        refinementList: { category: ["Bible", "Prayer"] },
      });
      expect(params.getAll("category")).toEqual(["Bible", "Prayer"]);
    });

    it("serializes custom params", () => {
      const params = config.toParams({ campus: "PBG", age: "25" });
      expect(params.get("campus")).toBe("PBG");
      expect(params.get("age")).toBe("25");
    });

    it("omits empty query (whitespace only)", () => {
      const params = config.toParams({ query: "   " });
      expect(params.has("q")).toBe(false);
    });

    it("omits empty refinement values", () => {
      const params = config.toParams({
        refinementList: { category: ["", "Bible"] },
      });
      expect(params.getAll("category")).toEqual(["Bible"]);
    });
  });

  describe("emptyState", () => {
    it("returns an empty object", () => {
      expect(config.emptyState).toEqual({});
    });
  });

  describe("roundtrip", () => {
    it("parse(toParams(state)) preserves state", () => {
      const state: TestState = {
        query: "groups",
        refinementList: { category: ["Bible"], day: ["Monday", "Wednesday"] },
        campus: "PBG",
      };
      const roundtripped = config.parse(config.toParams(state));
      expect(roundtripped.query).toBe("groups");
      expect(roundtripped.refinementList).toEqual(state.refinementList);
      expect(roundtripped.campus).toBe("PBG");
    });
  });
});
```

**Edge cases:** Empty params, whitespace-only query, multi-value refinements, roundtrip stability.

**Coverage goal:** 90% lines.

---

## Priority 4: `app/lib/gtm.ts`

### File: `app/lib/__tests__/gtm.test.ts`

**Mocking requirements:** None — uses `window.dataLayer` (jsdom provides `window`).

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { pushFormEvent } from "../gtm";

describe("pushFormEvent", () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it("pushes form_start event to dataLayer", () => {
    pushFormEvent("form_start", "contact-form", "Contact Form");
    expect(window.dataLayer).toEqual([
      { event: "form_start", form_id: "contact-form", form_name: "Contact Form" },
    ]);
  });

  it("pushes form_complete event to dataLayer", () => {
    pushFormEvent("form_complete", "signup", "Sign Up");
    expect(window.dataLayer).toEqual([
      { event: "form_complete", form_id: "signup", form_name: "Sign Up" },
    ]);
  });

  it("initializes dataLayer if undefined", () => {
    delete (window as { dataLayer?: unknown[] }).dataLayer;
    pushFormEvent("form_start", "test", "Test");
    expect(window.dataLayer).toHaveLength(1);
  });
});
```

**Coverage goal:** 100%.

---

## Priority 5: `app/lib/generate-meta-keywords.ts`

### File: `app/lib/__tests__/generate-meta-keywords.test.ts`

**Mocking requirements:** None.

```ts
import { describe, it, expect } from "vitest";
import { generateMetaKeywords } from "../generate-meta-keywords";
import { DEFAULT_KEYWORDS } from "../meta-utils";

describe("generateMetaKeywords", () => {
  it("returns default keywords when no options provided", () => {
    expect(generateMetaKeywords({})).toBe(DEFAULT_KEYWORDS);
  });

  it("includes title words", () => {
    const result = generateMetaKeywords({ title: "Finding Hope in Hard Times" });
    expect(result).toContain("finding");
    expect(result).toContain("hope");
  });

  it("includes category values", () => {
    const result = generateMetaKeywords({ categories: ["Bible Study", "Prayer"] });
    expect(result).toContain("Bible Study");
    expect(result).toContain("Prayer");
  });

  it("includes author name", () => {
    const result = generateMetaKeywords({ authorOrSpeaker: "Todd Mullins" });
    expect(result).toContain("todd");
    expect(result).toContain("mullins");
  });

  it("includes series title", () => {
    const result = generateMetaKeywords({ seriesTitle: "The Journey" });
    expect(result).toContain("journey");
  });

  it("adds type-specific terms for message", () => {
    const result = generateMetaKeywords({ type: "message" });
    expect(result).toContain("sermon");
    expect(result).toContain("message");
  });

  it("adds type-specific terms for event", () => {
    const result = generateMetaKeywords({ type: "event" });
    expect(result).toContain("event");
  });

  it("adds type-specific terms for article", () => {
    const result = generateMetaKeywords({ type: "article" });
    expect(result).toContain("article");
    expect(result).toContain("blog");
  });

  it("adds type-specific terms for podcast", () => {
    const result = generateMetaKeywords({ type: "podcast" });
    expect(result).toContain("podcast");
  });

  it("appends default keywords by default", () => {
    const result = generateMetaKeywords({ title: "Test" });
    expect(result).toContain(DEFAULT_KEYWORDS);
  });

  it("omits default keywords when includeDefaults is false", () => {
    const result = generateMetaKeywords({ title: "Test", includeDefaults: false });
    expect(result).not.toContain("church South Florida");
  });

  it("deduplicates terms", () => {
    const result = generateMetaKeywords({
      title: "Christ Fellowship Event",
      type: "event",
    });
    // "Christ Fellowship" appears in both title and type terms — should not duplicate
    const matches = result.match(/christ/gi) ?? [];
    expect(matches.length).toBeLessThanOrEqual(3); // content + defaults
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
});
```

**Coverage goal:** 90% lines.

---

## Priority 6: `app/hooks/use-responsive.ts`

### File: `app/hooks/__tests__/use-responsive.test.ts`

**Mocking requirements:**
- Mock `window.innerWidth` and fire `resize` events

```ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useResponsive, breakpoints } from "../use-responsive";

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", { value: width, writable: true });
  window.dispatchEvent(new Event("resize"));
}

describe("useResponsive", () => {
  it("returns all false before mount (SSR-safe default)", () => {
    // On first render before useEffect fires, width is null
    const { result } = renderHook(() => useResponsive());
    // After mount, useEffect has fired — check initial width matches window
    expect(result.current.breakpoints).toBe(breakpoints);
  });

  it("detects xSmall viewport (< 640px)", () => {
    const { result } = renderHook(() => useResponsive());
    act(() => setWindowWidth(480));
    expect(result.current.isXSmall).toBe(true);
    expect(result.current.isSmall).toBe(true);
    expect(result.current.isLarge).toBe(false);
  });

  it("detects medium viewport (768-1023px)", () => {
    const { result } = renderHook(() => useResponsive());
    act(() => setWindowWidth(900));
    expect(result.current.isMedium).toBe(true);
    expect(result.current.isSmall).toBe(false);
    expect(result.current.isLarge).toBe(false);
  });

  it("detects large viewport (>= 1024px)", () => {
    const { result } = renderHook(() => useResponsive());
    act(() => setWindowWidth(1200));
    expect(result.current.isLarge).toBe(true);
    expect(result.current.isXLarge).toBe(false);
  });

  it("detects xLarge viewport (>= 1280px)", () => {
    const { result } = renderHook(() => useResponsive());
    act(() => setWindowWidth(1400));
    expect(result.current.isXLarge).toBe(true);
  });

  it("detects xxLarge viewport (>= 1536px)", () => {
    const { result } = renderHook(() => useResponsive());
    act(() => setWindowWidth(1600));
    expect(result.current.isXXLarge).toBe(true);
  });

  it("updates on window resize", () => {
    const { result } = renderHook(() => useResponsive());
    act(() => setWindowWidth(500));
    expect(result.current.isXSmall).toBe(true);

    act(() => setWindowWidth(1200));
    expect(result.current.isXSmall).toBe(false);
    expect(result.current.isLarge).toBe(true);
  });

  it("cleans up resize listener on unmount", () => {
    const removeListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useResponsive());
    unmount();
    expect(removeListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeListenerSpy.mockRestore();
  });
});
```

**Edge cases:** Boundary values (639, 640, 767, 768, 1023, 1024, 1279, 1280, 1535, 1536), resize event cleanup.

**Coverage goal:** 85% lines.

---

## Priority 7: `app/hooks/use-algolia-url-sync.ts`

### File: `app/hooks/__tests__/use-algolia-url-sync.test.ts`

**Mocking requirements:**
- Mock `setSearchParams` as `vi.fn()`
- Use `vi.useFakeTimers()` for debounce testing

```ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAlgoliaUrlSync } from "../use-algolia-url-sync";

describe("useAlgoliaUrlSync", () => {
  const setSearchParams = vi.fn();
  const toParams = vi.fn((state: { q?: string }) => {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    return p;
  });

  beforeEach(() => {
    vi.useFakeTimers();
    setSearchParams.mockClear();
    toParams.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderSync(searchParams = new URLSearchParams()) {
    return renderHook(() =>
      useAlgoliaUrlSync({
        searchParams,
        setSearchParams,
        toParams,
        debounceMs: 400,
      })
    );
  }

  it("updateUrlIfChanged calls setSearchParams when params differ", () => {
    const { result } = renderSync();
    act(() => result.current.updateUrlIfChanged({ q: "hello" }));
    expect(setSearchParams).toHaveBeenCalledTimes(1);
  });

  it("updateUrlIfChanged does NOT call setSearchParams when params are same", () => {
    const { result } = renderSync(new URLSearchParams("q=hello"));
    act(() => result.current.updateUrlIfChanged({ q: "hello" }));
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it("debouncedUpdateUrl delays the URL update", () => {
    const { result } = renderSync();
    act(() => result.current.debouncedUpdateUrl({ q: "search" }));

    // Not called yet
    expect(setSearchParams).not.toHaveBeenCalled();

    // Advance past debounce
    act(() => vi.advanceTimersByTime(400));
    expect(setSearchParams).toHaveBeenCalledTimes(1);
  });

  it("debouncedUpdateUrl resets timer on rapid calls", () => {
    const { result } = renderSync();

    act(() => result.current.debouncedUpdateUrl({ q: "a" }));
    act(() => vi.advanceTimersByTime(200));
    act(() => result.current.debouncedUpdateUrl({ q: "ab" }));
    act(() => vi.advanceTimersByTime(200));

    // First call should have been cancelled
    expect(setSearchParams).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));
    expect(setSearchParams).toHaveBeenCalledTimes(1);
  });

  it("cancelDebounce prevents pending update", () => {
    const { result } = renderSync();
    act(() => result.current.debouncedUpdateUrl({ q: "hello" }));
    act(() => result.current.cancelDebounce());
    act(() => vi.advanceTimersByTime(500));
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it("cleans up timer on unmount", () => {
    const { result, unmount } = renderSync();
    act(() => result.current.debouncedUpdateUrl({ q: "hello" }));
    unmount();
    act(() => vi.advanceTimersByTime(500));
    expect(setSearchParams).not.toHaveBeenCalled();
  });
});
```

**Edge cases:** Debounce reset on rapid calls, cancel mid-debounce, cleanup on unmount, same-params no-op.

**Coverage goal:** 85% lines.

---

## Priority 8: `app/hooks/use-map-dimensions.ts`

### File: `app/hooks/__tests__/use-map-dimensions.test.ts`

**Mocking requirements:**
- `ResizeObserver` is already mocked in `vitest.setup.ts`
- Need to mock `getBoundingClientRect` on the ref element

```ts
import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useMapDimensions } from "../use-map-dimensions";

describe("useMapDimensions", () => {
  it("returns ref, dimensions, and offset", () => {
    const { result } = renderHook(() => useMapDimensions());
    expect(result.current.ref).toBeDefined();
    expect(result.current.dimensions).toEqual({ width: 0, height: 0 });
    expect(typeof result.current.offset).toBe("number");
  });

  it("initializes with zero dimensions when no element is attached", () => {
    const { result } = renderHook(() => useMapDimensions());
    expect(result.current.dimensions.width).toBe(0);
    expect(result.current.dimensions.height).toBe(0);
  });
});
```

**Coverage goal:** 80% lines.

---

## Priority 9: `app/hooks/use-scroll-to-search-results-on-load.ts`

### File: `app/hooks/__tests__/use-scroll-to-search-results-on-load.test.ts`

**Mocking requirements:**
- Mock `document.querySelector` and `element.scrollIntoView`
- Mock `window.setTimeout` / `window.requestAnimationFrame`

```ts
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useScrollToSearchResultsOnLoad } from "../use-scroll-to-search-results-on-load";

describe("useScrollToSearchResultsOnLoad", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not scroll when no active filters", () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, "querySelector").mockReturnValue({
      scrollIntoView,
    } as unknown as Element);

    const hasActiveFilters = vi.fn().mockReturnValue(false);
    renderHook(() =>
      useScrollToSearchResultsOnLoad(new URLSearchParams(), hasActiveFilters)
    );

    vi.advanceTimersByTime(500);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("scrolls to target when active filters exist", () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, "querySelector").mockReturnValue({
      scrollIntoView,
    } as unknown as Element);

    // Mock requestAnimationFrame to execute callback immediately
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    const hasActiveFilters = vi.fn().mockReturnValue(true);
    renderHook(() =>
      useScrollToSearchResultsOnLoad(
        new URLSearchParams("q=test"),
        hasActiveFilters
      )
    );

    vi.advanceTimersByTime(500);
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("only scrolls once (hasScrolledRef guard)", () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, "querySelector").mockReturnValue({
      scrollIntoView,
    } as unknown as Element);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    const hasActiveFilters = vi.fn().mockReturnValue(true);
    const { rerender } = renderHook(
      ({ params }) => useScrollToSearchResultsOnLoad(params, hasActiveFilters),
      { initialProps: { params: new URLSearchParams("q=test") } }
    );

    vi.advanceTimersByTime(500);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);

    // Re-render with same params — should not scroll again
    rerender({ params: new URLSearchParams("q=test") });
    vi.advanceTimersByTime(500);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });
});
```

**Coverage goal:** 85% lines.

---

## Priority 10: `app/primitives/button/`

### File: `app/primitives/button/__tests__/index.test.tsx`

**Mocking requirements:** Needs `<MemoryRouter>` for `<Link>`.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../button.primitive";

function renderButton(props: React.ComponentProps<typeof Button>) {
  return render(
    <MemoryRouter>
      <Button {...props} />
    </MemoryRouter>
  );
}

describe("Button", () => {
  it("renders children text", () => {
    renderButton({ children: "Click me" });
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies primary intent styles by default", () => {
    renderButton({ children: "Primary" });
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-ocean");
  });

  it("applies secondary intent styles", () => {
    renderButton({ children: "Secondary", intent: "secondary" });
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border-ocean");
  });

  it("applies white intent styles", () => {
    renderButton({ children: "White", intent: "white" });
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-white");
  });

  it("applies size variants", () => {
    renderButton({ children: "Small", size: "sm" });
    expect(screen.getByRole("button").className).toContain("min-w-20");
  });

  it("applies underline when true", () => {
    renderButton({ children: "Underline", underline: true });
    expect(screen.getByRole("button").className).toContain("underline");
  });

  it("wraps in Link when href is provided", () => {
    renderButton({ children: "Go", href: "/about" });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/about");
  });

  it("sets target=_blank for external href", () => {
    renderButton({ children: "External", href: "https://example.com" });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("fires onClick handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton({ children: "Click", onClick });
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <MemoryRouter>
        <Button ref={ref}>Ref</Button>
      </MemoryRouter>
    );
    expect(ref).toHaveBeenCalled();
  });

  it("passes additional HTML attributes", () => {
    renderButton({ children: "Disabled", disabled: true });
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

**Edge cases:** href vs no href rendering, external vs internal link target, disabled state, ref forwarding.

**Coverage goal:** 80% lines.

---

## Priority 11: `app/primitives/inputs/`

### File: `app/primitives/inputs/checkbox/__tests__/index.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "../checkbox.primitive";

describe("Checkbox", () => {
  it("renders label text", () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders checked state", () => {
    render(<Checkbox checked={true} onChange={vi.fn()} label="Accept" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("calls onChange when clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox checked={false} onChange={onChange} label="Accept" />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("shows required indicator when required", () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="Required field" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
```

### File: `app/primitives/inputs/text-field/__tests__/index.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TextField } from "../text-field.primitive";

describe("TextField", () => {
  it("renders with label", () => {
    render(<TextField label="Email" value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("displays current value", () => {
    render(<TextField label="Email" value="test@test.com" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("test@test.com")).toBeInTheDocument();
  });

  it("calls onChange on input", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TextField label="Email" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText("Email"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows error message when provided", () => {
    render(<TextField label="Email" value="" onChange={vi.fn()} error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("renders as required when required prop is set", () => {
    render(<TextField label="Email" value="" onChange={vi.fn()} required />);
    expect(screen.getByLabelText(/Email/)).toBeRequired();
  });

  it("renders placeholder text", () => {
    render(<TextField label="Email" value="" onChange={vi.fn()} placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });
});
```

Create similar test files for:
- `app/primitives/inputs/dropdown/__tests__/index.test.tsx`
- `app/primitives/inputs/date-input/__tests__/index.test.tsx`
- `app/primitives/inputs/select-input/__tests__/index.test.tsx`
- `app/primitives/inputs/slider/__tests__/index.test.tsx`
- `app/primitives/inputs/radio-buttons/__tests__/index.test.tsx`
- `app/primitives/inputs/text-field/__tests__/secure-text-field.test.tsx`

For each: test rendering, user interaction (onChange), edge cases (empty, required, disabled), and accessibility (labels, roles).

**Coverage goal:** 80% lines across all inputs.

---

## Priority 12: `app/primitives/icon/`

### File: `app/primitives/icon/__tests__/index.test.tsx`

Read `app/primitives/icon/icon.tsx` first. The icon component renders SVG paths from the icon library.

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Icon from "../index";

describe("Icon", () => {
  it("renders an SVG element", () => {
    render(<Icon name="searchAlt" />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies custom size", () => {
    render(<Icon name="searchAlt" size={32} />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("applies custom color", () => {
    render(<Icon name="searchAlt" color="red" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("fill", "red");
  });

  it("renders nothing for unknown icon name", () => {
    render(<Icon name={"nonexistent" as string} />);
    // Verify it renders gracefully (no crash)
  });
});
```

**Coverage goal:** 80% lines.

---

## Priority 13: `app/primitives/Modal/`

### File: `app/primitives/Modal/__tests__/index.test.tsx`

**Mocking requirements:** Radix UI Dialog renders in portal — use `screen` queries.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "../modal.primitive";

describe("Modal", () => {
  it("renders children when open", () => {
    render(
      <Modal open={true}>
        <Modal.Content>
          <p>Modal content</p>
        </Modal.Content>
      </Modal>
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render content when closed", () => {
    render(
      <Modal open={false}>
        <Modal.Content>
          <p>Hidden content</p>
        </Modal.Content>
      </Modal>
    );
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Modal open={true}>
        <Modal.Content title="Test Title">
          <p>Body</p>
        </Modal.Content>
      </Modal>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <Modal open={true}>
        <Modal.Content description="A description">
          <p>Body</p>
        </Modal.Content>
      </Modal>
    );
    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(
      <Modal open={true}>
        <Modal.Content>
          <p>Body</p>
        </Modal.Content>
      </Modal>
    );
    // Close button has Cross2Icon — check it exists
    const closeBtn = document.querySelector("[class*='cursor-pointer']");
    expect(closeBtn).toBeInTheDocument();
  });

  it("calls onOpenChange when closed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange}>
        <Modal.Content>
          <p>Body</p>
        </Modal.Content>
      </Modal>
    );
    // Click the close button
    const closeBtn = document.querySelector("button[class*='cursor-pointer']");
    if (closeBtn) await user.click(closeBtn);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders trigger button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal onOpenChange={onOpenChange}>
        <Modal.Button>Open</Modal.Button>
        <Modal.Content>
          <p>Body</p>
        </Modal.Content>
      </Modal>
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });
});
```

**Edge cases:** Open/closed state, title vs no title (VisuallyHidden), close button interaction, background styling.

**Coverage goal:** 80% lines.

---

## Priority 14: `app/primitives/cards/`

### File: `app/primitives/cards/resource-card/__tests__/index.test.tsx`

Read the actual card component first. Test rendering with various props, image display, link behavior.

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
// Import the actual component — adjust path based on what you find
import { ResourceCard } from "../resource-card.component";

describe("ResourceCard", () => {
  const defaultProps = {
    title: "Test Resource",
    description: "A test description",
    image: "/test-image.jpg",
    href: "/resources/test",
  };

  function renderCard(props = defaultProps) {
    return render(
      <MemoryRouter>
        <ResourceCard {...props} />
      </MemoryRouter>
    );
  }

  it("renders title", () => {
    renderCard();
    expect(screen.getByText("Test Resource")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderCard();
    expect(screen.getByText("A test description")).toBeInTheDocument();
  });

  it("renders image with correct src", () => {
    renderCard();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/test-image.jpg");
  });

  it("links to correct href", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/resources/test");
  });
});
```

Create a similar test for `ministry-card`. Read each component first to verify props.

**Coverage goal:** 75% lines.

---

## Priority 15: `app/providers/auth-provider/`

### File: `app/providers/auth-provider/__tests__/index.test.tsx`

**Mocking requirements:**
- Mock `fetch` globally for all auth API calls
- Mock `react-router-dom` hooks: `useNavigate`, `useRevalidator`
- Mock `localStorage` and `document.cookie`

```tsx
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  AuthProvider,
  useAuth,
  AUTH_TOKEN_KEY,
} from "../index";

// Mock useRevalidator
const mockRevalidate = vi.fn();
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useRevalidator: () => ({ revalidate: mockRevalidate }),
    useNavigate: () => mockNavigate,
  };
});

// Test consumer component
function TestConsumer() {
  const { user, isLoading, loginWithEmail, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="user">{user?.fullName ?? "null"}</span>
      <button onClick={() => loginWithEmail("test@test.com", "pass123")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function renderAuth() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = `${AUTH_TOKEN_KEY}=; Max-Age=0; path=/;`;
    vi.restoreAllMocks();
    mockRevalidate.mockClear();
    mockNavigate.mockClear();
    global.fetch = vi.fn();
  });

  it("starts with isLoading true", () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "No token" }),
    });
    renderAuth();
    // isLoading starts true — then resolves
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("loads user from stored token on mount", async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "encrypted-token");
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "1",
          fullName: "John Doe",
          email: "john@test.com",
          phoneNumber: "5551234567",
          guid: "abc-123",
          gender: "Male",
          birthDate: "1990-01-01",
          photo: "/photo.jpg",
        }),
    });

    renderAuth();
    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("John Doe");
    });
  });

  it("sets user to null when no token exists", async () => {
    renderAuth();
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("user")).toHaveTextContent("null");
    });
  });

  it("logout clears user, token, and cookie", async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "token");
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "1",
          fullName: "John Doe",
          email: "john@test.com",
          phoneNumber: "",
          guid: "abc",
          gender: "Male",
          birthDate: "1990-01-01",
          photo: "",
        }),
    });

    const user = userEvent.setup();
    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("John Doe");
    });

    await user.click(screen.getByText("Logout"));

    expect(screen.getByTestId("user")).toHaveTextContent("null");
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    expect(mockRevalidate).toHaveBeenCalled();
  });
});

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      render(<TestConsumer />);
    }).toThrow("useAuth must be used within an AuthProvider");
    spy.mockRestore();
  });
});
```

**Edge cases:**
- No token in localStorage on mount
- Token exists but fetch fails (expired/invalid)
- loginWithEmail success flow (two fetch calls: authenticate + currentUser)
- loginWithEmail failure (non-ok response)
- logout clears everything
- useAuth outside provider throws
- requestSmsPin and loginWithSms flows

**Coverage goal:** 80% lines.

---

## Priority 16: `app/providers/cookie-consent-provider.tsx`

### File: `app/providers/__tests__/cookie-consent-provider.test.tsx`

**Mocking requirements:**
- Mock the `CookieConsent` child component (or let it render)
- `localStorage`, `sessionStorage`, `window.dataLayer` (jsdom provides these)

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CookieConsentProvider, useCookieConsent } from "../cookie-consent-provider";

// Mock the CookieConsent UI component to simplify testing
vi.mock("~/components/cookie-consent", () => ({
  CookieConsent: ({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) => (
    <div>
      <button onClick={onAccept}>Accept</button>
      <button onClick={onDecline}>Decline</button>
    </div>
  ),
}));

function TestConsumer() {
  const { hasConsent, acceptCookies, declineCookies } = useCookieConsent();
  return <span data-testid="consent">{String(hasConsent)}</span>;
}

function renderProvider() {
  return render(
    <MemoryRouter>
      <CookieConsentProvider>
        <TestConsumer />
      </CookieConsentProvider>
    </MemoryRouter>
  );
}

describe("CookieConsentProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.dataLayer = [];
  });

  it("renders children and cookie consent UI", () => {
    renderProvider();
    expect(screen.getByTestId("consent")).toBeInTheDocument();
    expect(screen.getByText("Accept")).toBeInTheDocument();
  });

  it("pushes consent update to dataLayer when accepted", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByText("Accept"));
    expect(localStorage.getItem("cookieConsent")).toBe("true");
    expect(window.dataLayer.some((e: Record<string, unknown>) => e.event === "cookie_consent_accepted")).toBe(true);
  });

  it("pushes declined event to dataLayer when declined", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByText("Decline"));
    expect(localStorage.getItem("cookieConsent")).toBe("false");
    expect(window.dataLayer.some((e: Record<string, unknown>) => e.event === "cookie_consent_declined")).toBe(true);
  });

  it("re-applies accepted consent on mount", () => {
    localStorage.setItem("cookieConsent", "true");
    renderProvider();
    // dataLayer should have consent update pushed
    expect(window.dataLayer.length).toBeGreaterThan(0);
  });
});

describe("useCookieConsent", () => {
  it("throws when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
    spy.mockRestore();
  });
});
```

**Coverage goal:** 80% lines.

---

## Priority 17: `app/providers/navbar-visibility-context.tsx`

### File: `app/providers/__tests__/navbar-visibility-context.test.tsx`

**Mocking requirements:** None.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import {
  NavbarVisibilityProvider,
  useNavbarVisibility,
} from "../navbar-visibility-context";

function TestConsumer() {
  const { isNavbarVisible, setIsNavbarVisible } = useNavbarVisibility();
  return (
    <div>
      <span data-testid="visible">{String(isNavbarVisible)}</span>
      <button onClick={() => setIsNavbarVisible(false)}>Hide</button>
      <button onClick={() => setIsNavbarVisible(true)}>Show</button>
    </div>
  );
}

describe("NavbarVisibilityProvider", () => {
  it("defaults to visible", () => {
    render(
      <NavbarVisibilityProvider>
        <TestConsumer />
      </NavbarVisibilityProvider>
    );
    expect(screen.getByTestId("visible")).toHaveTextContent("true");
  });

  it("can hide navbar", async () => {
    const user = userEvent.setup();
    render(
      <NavbarVisibilityProvider>
        <TestConsumer />
      </NavbarVisibilityProvider>
    );
    await user.click(screen.getByText("Hide"));
    expect(screen.getByTestId("visible")).toHaveTextContent("false");
  });

  it("can show navbar after hiding", async () => {
    const user = userEvent.setup();
    render(
      <NavbarVisibilityProvider>
        <TestConsumer />
      </NavbarVisibilityProvider>
    );
    await user.click(screen.getByText("Hide"));
    await user.click(screen.getByText("Show"));
    expect(screen.getByTestId("visible")).toHaveTextContent("true");
  });
});

describe("useNavbarVisibility", () => {
  it("throws when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useNavbarVisibility must be used within a NavbarVisibilityProvider"
    );
    spy.mockRestore();
  });
});
```

**Coverage goal:** 100%.

---

## Priority 18: `app/lib/.server/error-types.ts`

### File: `app/lib/.server/__tests__/error-types.test.ts`

**Mocking requirements:** None.

```ts
import { describe, it, expect } from "vitest";
import { AuthenticationError, RockAPIError, EncryptionError } from "../error-types";

describe("AuthenticationError", () => {
  it("sets name to AuthenticationError", () => {
    const error = new AuthenticationError("Invalid token");
    expect(error.name).toBe("AuthenticationError");
    expect(error.message).toBe("Invalid token");
    expect(error).toBeInstanceOf(Error);
  });

  it("preserves cause", () => {
    const cause = new Error("root cause");
    const error = new AuthenticationError("Wrapper", { cause });
    expect(error.cause).toBe(cause);
  });
});

describe("RockAPIError", () => {
  it("sets name and statusCode", () => {
    const error = new RockAPIError("Not found", 404);
    expect(error.name).toBe("RockAPIError");
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Not found");
  });

  it("preserves cause", () => {
    const cause = new Error("fetch failed");
    const error = new RockAPIError("API error", 500, { cause });
    expect(error.cause).toBe(cause);
  });
});

describe("EncryptionError", () => {
  it("sets name to EncryptionError", () => {
    const error = new EncryptionError("Encryption failed");
    expect(error.name).toBe("EncryptionError");
    expect(error.message).toBe("Encryption failed");
  });
});
```

**Coverage goal:** 100%.

---

## Priority 19: `app/lib/.server/token.ts`

### File: `app/lib/.server/__tests__/token.test.ts`

**Mocking requirements:**
- Set `process.env.SECRET` for JWT signing/verification

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseToken, registerToken, generateToken } from "../token";
import jwt from "jsonwebtoken";

describe("token utilities", () => {
  const TEST_SECRET = "test-secret-key";

  beforeEach(() => {
    vi.stubEnv("SECRET", TEST_SECRET);
  });

  describe("generateToken", () => {
    it("generates a valid JWT", () => {
      const token = generateToken({ cookie: "test-cookie", sessionId: "session-1" });
      const decoded = jwt.verify(token, TEST_SECRET) as Record<string, unknown>;
      expect(decoded.cookie).toBe("test-cookie");
      expect(decoded.sessionId).toBe("session-1");
    });

    it("throws if SECRET is not set", () => {
      vi.stubEnv("SECRET", "");
      // Clear the env var
      delete process.env.SECRET;
      expect(() => generateToken({ cookie: "c" })).toThrow("Missing SECRET");
    });
  });

  describe("parseToken", () => {
    it("parses a valid token", () => {
      const token = jwt.sign({ cookie: "c", sessionId: "s" }, TEST_SECRET);
      const result = parseToken(token);
      expect(result.cookie).toBe("c");
      expect(result.sessionId).toBe("s");
    });

    it("throws for invalid token", () => {
      expect(() => parseToken("invalid-token")).toThrow();
    });

    it("throws for expired token", () => {
      const token = jwt.sign({ cookie: "c", sessionId: "s" }, TEST_SECRET, {
        expiresIn: "-1s",
      });
      expect(() => parseToken(token)).toThrow();
    });
  });

  describe("registerToken", () => {
    it("returns token data for valid token", () => {
      const token = jwt.sign({ cookie: "c", sessionId: "s" }, TEST_SECRET);
      const result = registerToken(token);
      expect(result.userToken).toBe(token);
      expect(result.rockCookie).toBe("c");
      expect(result.sessionId).toBe("s");
    });

    it("returns empty object for expired token", () => {
      const token = jwt.sign({ cookie: "c", sessionId: "s" }, TEST_SECRET, {
        expiresIn: "-1s",
      });
      const result = registerToken(token);
      expect(result).toEqual({});
    });

    it("throws UNAUTHENTICATED for otherwise invalid token", () => {
      expect(() => registerToken("garbage")).toThrow("Invalid token");
    });
  });
});
```

**Edge cases:** Missing SECRET env var, expired token, invalid/malformed token, valid roundtrip.

**Coverage goal:** 90% lines.

---

## Priority 20: `app/lib/.server/rock-utils.ts`

### File: `app/lib/.server/__tests__/rock-utils.test.ts`

**Mocking requirements:**
- Mock `~/lib/.server/fetch-rock-data` for `getAttributeMatrixItems`

```ts
import { describe, it, expect, vi } from "vitest";
import { attributeIsImage, getImages } from "../rock-utils";

vi.mock("~/lib/.server/fetch-rock-data", () => ({
  fetchRockData: vi.fn(),
}));

describe("attributeIsImage", () => {
  it("returns true when key contains 'image' and value is string", () => {
    expect(
      attributeIsImage({
        key: "CoverImage",
        attributeValues: { CoverImage: { value: "some-guid" } },
      })
    ).toBe(true);
  });

  it("returns false when key does not contain 'image'", () => {
    expect(
      attributeIsImage({
        key: "Title",
        attributeValues: { Title: { value: "Hello" } },
      })
    ).toBe(false);
  });

  it("returns false when value is not a string", () => {
    expect(
      attributeIsImage({
        key: "ProfileImage",
        attributeValues: { ProfileImage: { value: 123 } },
      })
    ).toBe(false);
  });
});

describe("getImages", () => {
  it("returns image URLs for image attributes", () => {
    const result = getImages({
      attributeValues: {
        coverImage: { value: "abc12345-1234-1234-1234-123456789abc" },
        title: { value: "Hello" },
      },
      attributes: {
        coverImage: {},
        title: {},
      },
    });
    // Only coverImage matches — its key contains "image"
    expect(result).toHaveLength(1);
  });

  it("returns empty array when no image attributes", () => {
    const result = getImages({
      attributeValues: { title: { value: "Hello" } },
      attributes: { title: {} },
    });
    expect(result).toEqual([]);
  });
});
```

**Coverage goal:** 80% lines.

---

## Priority 21: `app/lib/.server/fetch-rock-data.ts`

### File: `app/lib/.server/__tests__/fetch-rock-data.test.ts`

**Mocking requirements:**
- Mock `global.fetch`
- Mock `~/lib/.server/redis-config` (redis client)
- Mock `process.env.ROCK_API` and `process.env.ROCK_TOKEN`

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchRockData,
  postRockData,
  patchRockData,
  deleteRockData,
  deleteCacheKey,
  isItemInDateRange,
} from "../fetch-rock-data";

// Mock redis
vi.mock("~/lib/.server/redis-config", () => ({
  default: null, // no redis in tests
}));

describe("isItemInDateRange", () => {
  const now = new Date("2025-06-15T12:00:00Z");

  it("returns true when item has no date constraints", () => {
    expect(isItemInDateRange({}, now)).toBe(true);
  });

  it("returns true when now is within range", () => {
    expect(
      isItemInDateRange(
        { startDateTime: "2025-06-01", expireDateTime: "2025-07-01" },
        now
      )
    ).toBe(true);
  });

  it("returns false when now is before start", () => {
    expect(
      isItemInDateRange({ startDateTime: "2025-07-01" }, now)
    ).toBe(false);
  });

  it("returns false when now is after expire", () => {
    expect(
      isItemInDateRange({ expireDateTime: "2025-06-01" }, now)
    ).toBe(false);
  });

  it("handles PascalCase keys", () => {
    expect(
      isItemInDateRange(
        { StartDateTime: "2025-06-01", ExpireDateTime: "2025-07-01" },
        now
      )
    ).toBe(true);
  });
});

describe("fetchRockData", () => {
  beforeEach(() => {
    vi.stubEnv("ROCK_API", "https://rock.test.com/api");
    vi.stubEnv("ROCK_TOKEN", "test-token");
    global.fetch = vi.fn();
  });

  it("makes GET request to Rock API", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ FirstName: "John" }]),
    });

    const result = await fetchRockData({
      endpoint: "People",
      queryParams: { $top: "1" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://rock.test.com/apiPeople"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Authorization-Token": "test-token",
        }),
      })
    );
    // normalize converts PascalCase to camelCase
    expect(result).toEqual({ firstName: "John" }); // single-item array unwrapped
  });

  it("unwraps single-item arrays", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ Id: 1 }]),
    });

    const result = await fetchRockData({ endpoint: "People" });
    expect(result).toEqual({ id: 1 }); // unwrapped from array
  });

  it("keeps multi-item arrays as arrays", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ Id: 1 }, { Id: 2 }]),
    });

    const result = await fetchRockData({ endpoint: "People" });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("throws on non-ok response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve("Not Found"),
    });

    await expect(
      fetchRockData({ endpoint: "People/999999" })
    ).rejects.toThrow("Error Fetching Rock Data");
  });

  it("includes custom headers", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await fetchRockData({
      endpoint: "People/GetCurrentPerson",
      customHeaders: { Cookie: "session=abc" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Cookie: "session=abc" }),
      })
    );
  });
});

describe("postRockData", () => {
  beforeEach(() => {
    vi.stubEnv("ROCK_API", "https://rock.test.com/api");
    vi.stubEnv("ROCK_TOKEN", "test-token");
    global.fetch = vi.fn();
  });

  it("sends POST request with JSON body", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("123"),
    });

    const result = await postRockData({
      endpoint: "People",
      body: { FirstName: "John" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("People"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ FirstName: "John" }),
      })
    );
    expect(result).toBe(123);
  });

  it("returns empty object for empty response body", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(""),
    });

    const result = await postRockData({
      endpoint: "Some/Action",
      body: {},
    });
    expect(result).toEqual({});
  });

  it("throws on non-ok response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve("Bad Request"),
    });

    await expect(
      postRockData({ endpoint: "People", body: {} })
    ).rejects.toThrow("Failed to post data");
  });
});

describe("patchRockData", () => {
  beforeEach(() => {
    vi.stubEnv("ROCK_API", "https://rock.test.com/api");
    vi.stubEnv("ROCK_TOKEN", "test-token");
    global.fetch = vi.fn();
  });

  it("sends PATCH request and returns status", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await patchRockData({
      endpoint: "People/1",
      body: { Email: "new@test.com" },
    });
    expect(result).toBe(204);
  });
});

describe("deleteRockData", () => {
  beforeEach(() => {
    vi.stubEnv("ROCK_API", "https://rock.test.com/api");
    vi.stubEnv("ROCK_TOKEN", "test-token");
    global.fetch = vi.fn();
  });

  it("sends DELETE request and returns status", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const result = await deleteRockData("UserLogins/123");
    expect(result).toBe(200);
  });

  it("throws on non-ok response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve("Not found"),
    });

    await expect(deleteRockData("UserLogins/999")).rejects.toThrow(
      "Failed to delete resource"
    );
  });
});

describe("deleteCacheKey", () => {
  it("returns false when redis is not available", async () => {
    const result = await deleteCacheKey({ endpoint: "People" });
    expect(result).toBe(false);
  });
});
```

**Edge cases:**
- Single-item array unwrapping vs multi-item
- Non-ok responses (404, 500)
- Empty POST response body
- Custom headers merge
- filterByDateRange and filterByStatusApproved filter building
- Redis unavailable (null)

**Coverage goal:** 80% lines.

---

## Priorities 22-32: Remaining Modules (Summary)

For these later priorities, follow the same pattern. Here are the key details:

### Priority 22: `app/lib/.server/authentication/*.ts`

**Files to create:**
- `app/lib/.server/authentication/__tests__/rock-authentication.test.ts`
- `app/lib/.server/authentication/__tests__/sms-authentication.test.ts`
- `app/lib/.server/authentication/__tests__/authenticate-user.test.ts`
- `app/lib/.server/authentication/__tests__/get-user-from-request.test.ts`

**Mocking:** Mock `fetch-rock-data`, `fetch` (global), `twilio`, `token`, `encrypt`.

**Key test cases:**
- `fetchUserCookie`: valid credentials, invalid credentials (401), missing credentials, network error
- `getCurrentPerson`: valid cookie, missing cookie, person not found
- `createRockSession`: valid flow, missing primaryAliasId
- `registerPersonWithEmail`: new user flow, user already exists, phone number handling
- `requestSmsLogin`: valid phone, invalid phone, SMS send failure
- `parsePhoneNumberUtil`: valid US numbers, invalid numbers, international format
- `hashPassword`: deterministic hashing
- `generateSmsPinAndPassword`: 6-digit pin format
- `authenticateUser`: full success flow, auth failure, encryption failure
- `getUserFromRequest`: token in cookie, no token, redirect param

**Coverage goal:** 75% lines.

### Priority 23: `app/lib/.server/rock-person.ts`

**File:** `app/lib/.server/__tests__/rock-person.test.ts`

**Mock:** `fetch-rock-data` (fetchRockData, postRockData, patchRockData), `sms-authentication` (parsePhoneNumberUtil, createPhoneNumberInRock).

**Key test cases:**
- `createPerson`: maps fields to Rock format, calls postRockData
- `updatePerson`: updates email only if empty in Rock, creates phone number if not exists
- `getPersonByAliasGuid`: found person, person not found (returns null)
- `mapGender`: 0 → Unknown, 1 → Male, 2 → Female, invalid → undefined
- `mapInputFieldsToRock`: BirthDate parsing, invalid date throws, no BirthDate passes through

**Coverage goal:** 75% lines.

### Priority 24-25: Route Loaders and Actions

**Files:** `app/routes/home/__tests__/loader.test.ts`, `app/routes/group-finder/__tests__/loader.test.ts`, etc.

**Mock:** All `fetch-rock-data` functions, env vars for Algolia keys.

**Key test cases:**
- Loader returns expected data shape
- Loader handles API errors gracefully
- Action validates form data
- Action handles missing required fields

**Coverage goal:** 75% lines.

### Priorities 26-32: Components

For each component, follow the patterns established in the existing 5 tests:
1. Read the component source
2. Create `__tests__/index.test.tsx`
3. Use `MemoryRouter` for anything with `Link`/`useLocation`
4. Mock external deps (Algolia, Wistia, etc.)
5. Test: renders without crash, renders key content, user interactions, edge states (empty data, loading, error)

---

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test app/lib/__tests__/utils.test.ts

# Run with coverage
pnpm test:coverage

# Run in watch mode during development
pnpm test:watch

# Run with UI
pnpm test:ui
```

## Completion Checklist

After each priority module, verify:
- [ ] All tests pass: `pnpm test`
- [ ] No TypeScript errors: `pnpm typecheck` (or `npx tsc --noEmit`)
- [ ] Coverage meets target: `pnpm test:coverage`
- [ ] Tests follow naming conventions (`describe`/`it` blocks)
- [ ] No unnecessary mocks (prefer real implementations for pure functions)
- [ ] Edge cases covered (null, undefined, empty, boundary values)
