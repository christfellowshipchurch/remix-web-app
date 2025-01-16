import { AUTH_TOKEN_KEY } from "~/providers/auth-provider";
import { currentUser } from "~/routes/auth/current-user";

// Checks to see if a user is currently logged in via a cookie
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
    return { message: "Token not found!" };
  }

  return await currentUser(token);
};
