import { json, LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData, useRevalidator } from "@remix-run/react";
import AuthModal from "~/components/modals/auth";
import Button from "~/primitives/button";
import { AUTH_TOKEN_KEY, useAuth } from "~/providers/auth-provider";
import { currentUser } from "./auth/currentUser";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const isRedirect = url.searchParams.get("redirect");

  const token = request.headers
    .get("Cookie")
    ?.match(new RegExp(`${AUTH_TOKEN_KEY}=([^;]+)`))?.[1];

  if (!token) {
    if (isRedirect !== "false") {
      return redirect("/");
    }
    return json({ message: "Token not found!" });
  }

  return await currentUser(token);
};

export default function MyProfile() {
  const { fullName, email, photo }: any = useLoaderData();
  const { logout } = useAuth();

  return (
    <div className="p-10 text-wrap space-y-4">
      <img src={photo} alt="User profile" className="rounded-full w-32 h-32" />
      {fullName ? (
        <p className="text-xl font-bold">{fullName}</p>
      ) : (
        <p>Not logged in</p>
      )}
      <p>{email}</p>
      {fullName ? <Button onClick={logout}>Logout</Button> : <AuthModal />}
    </div>
  );
}
