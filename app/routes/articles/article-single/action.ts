import type { ActionFunctionArgs } from "react-router-dom";
import { data, redirect } from "react-router-dom";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return data(
      {
        errors: { title: "Title is required", content: "Content is required" },
      },
      { status: 400 }
    );
  }

  return redirect(`/posts/$someId`);
};
