import { render as rtlRender } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import type { RenderOptions } from "@testing-library/react";

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  route?: string;
}

export function render(
  ui: React.ReactElement,
  { route = "/" }: ExtendedRenderOptions = {}
) {
  return rtlRender(<BrowserRouter>{ui}</BrowserRouter>);
}

export * from "@testing-library/react";
export { render as rtlRender };
