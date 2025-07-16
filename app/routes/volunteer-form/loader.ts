import { LoaderFunctionArgs, redirect } from "react-router-dom";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // If the path is exactly /volunteer-form (no trailing slash or anything after)
  if (url.pathname === "/volunteer-form") {
    return redirect("/volunteer-form/welcome");
  }

  return Response.json({});
}
