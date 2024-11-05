import { json } from "@remix-run/node";
import { AUTH_TOKEN_KEY } from "~/providers/auth-provider";
import { currentUser } from "~/routes/auth/currentUser";

export const getUserFromRequest = async (request: Request) => {
  const url = new URL(request.url);
  const isRedirect = url.searchParams.get("redirect");

  const token = request.headers
    .get("Cookie")
    ?.match(new RegExp(`${AUTH_TOKEN_KEY}=([^;]+)`))?.[1];

  if (!token) {
    if (isRedirect !== "false") {
      return null; // Indicate that redirection is needed
    }
    return json({ message: "Token not found!" });
  }

  return await currentUser(token);
};
