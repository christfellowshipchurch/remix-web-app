import { describe, it, expect } from "vitest";
import {
  trimRemovingInvisibleUnicode,
  collapseHtmlToVisibleText,
} from "../text-content";

describe("trimRemovingInvisibleUnicode", () => {
  it("trims normal whitespace", () => {
    expect(trimRemovingInvisibleUnicode("  hello  ")).toBe("hello");
  });

  it("strips zero-width space and BOM", () => {
    const s = `\uFEFF\u200Bhello\u200C`;
    expect(trimRemovingInvisibleUnicode(s)).toBe("hello");
  });
});

describe("collapseHtmlToVisibleText", () => {
  it("returns empty for empty markup", () => {
    expect(collapseHtmlToVisibleText("<p></p>")).toBe("");
    expect(collapseHtmlToVisibleText("<p> </p>")).toBe("");
    expect(collapseHtmlToVisibleText("<br>")).toBe("");
    expect(collapseHtmlToVisibleText("<p>&nbsp;</p>")).toBe("");
  });

  it("keeps visible text", () => {
    expect(collapseHtmlToVisibleText("<p>Hello</p>")).toBe("Hello");
    expect(collapseHtmlToVisibleText(" <div>x</div> ")).toBe("x");
  });
});
