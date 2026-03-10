import { describe, it, expect, beforeEach } from "vitest";
import { pushFormEvent } from "../gtm";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | unknown[] | IArguments>;
  }
}

describe("pushFormEvent", () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it("pushes form_start event to dataLayer", () => {
    pushFormEvent("form_start", "contact-form", "Contact Form");
    expect(window.dataLayer).toEqual([
      {
        event: "form_start",
        form_id: "contact-form",
        form_name: "Contact Form",
      },
    ]);
  });

  it("pushes form_complete event to dataLayer", () => {
    pushFormEvent("form_complete", "signup", "Sign Up");
    expect(window.dataLayer).toEqual([
      { event: "form_complete", form_id: "signup", form_name: "Sign Up" },
    ]);
  });

  it("initializes dataLayer if not yet defined", () => {
    delete (window as { dataLayer?: unknown[] }).dataLayer;
    pushFormEvent("form_start", "test", "Test");
    expect(window.dataLayer).toHaveLength(1);
  });

  it("appends to existing dataLayer entries", () => {
    pushFormEvent("form_start", "form-a", "Form A");
    pushFormEvent("form_complete", "form-a", "Form A");
    expect(window.dataLayer).toHaveLength(2);
    expect((window.dataLayer[0] as Record<string, unknown>).event).toBe(
      "form_start"
    );
    expect((window.dataLayer[1] as Record<string, unknown>).event).toBe(
      "form_complete"
    );
  });
});
