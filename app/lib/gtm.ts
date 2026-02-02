export function pushFormEvent(
  event: "form_start" | "form_complete",
  formId: string,
  formName: string,
) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, form_id: formId, form_name: formName });
  }
}
