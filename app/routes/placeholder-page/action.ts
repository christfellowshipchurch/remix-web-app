import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return json(
      {
        errors: { title: "Title is required", content: "Content is required" },
      },
      { status: 400 }
    );
  }

  return redirect(`/posts/${post.id}`);
};
