import { describe, it, expect } from "vitest";
import {
  createAlgoliaUrlStateConfig,
  type AlgoliaUrlStateBase,
} from "../algolia-url-state";

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
      const params = new URLSearchParams(
        "category=Bible&category=Prayer&day=Monday"
      );
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

    it("ignores unknown refinement attributes", () => {
      const params = new URLSearchParams("unknown=value");
      const state = config.parse(params);
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

    it("omits whitespace-only query", () => {
      const params = config.toParams({ query: "   " });
      expect(params.has("q")).toBe(false);
    });

    it("omits empty refinement values", () => {
      const params = config.toParams({
        refinementList: { category: ["", "Bible"] },
      });
      expect(params.getAll("category")).toEqual(["Bible"]);
    });

    it("returns empty params for empty state", () => {
      const params = config.toParams({});
      expect(params.toString()).toBe("");
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
        refinementList: {
          category: ["Bible"],
          day: ["Monday", "Wednesday"],
        },
        campus: "PBG",
      };
      const roundtripped = config.parse(config.toParams(state));
      expect(roundtripped.query).toBe("groups");
      expect(roundtripped.refinementList).toEqual(state.refinementList);
      expect(roundtripped.campus).toBe("PBG");
    });

    it("empty state roundtrip produces empty state", () => {
      const roundtripped = config.parse(config.toParams({}));
      expect(roundtripped.query).toBeUndefined();
      expect(roundtripped.refinementList).toBeUndefined();
    });
  });
});

describe("createAlgoliaUrlStateConfig without custom", () => {
  const simpleConfig = createAlgoliaUrlStateConfig<AlgoliaUrlStateBase>({
    queryParamKey: "search",
    refinementAttributes: ["tag"],
  });

  it("parses query with custom key", () => {
    const state = simpleConfig.parse(new URLSearchParams("search=test"));
    expect(state.query).toBe("test");
  });

  it("serializes query with custom key", () => {
    const params = simpleConfig.toParams({ query: "test" });
    expect(params.get("search")).toBe("test");
  });
});
