import { LoaderFunction, redirect } from "react-router";
import { useLoaderData } from "react-router";
import AuthModal from "~/components/modals/auth";
import { Button } from "~/primitives/button/button.primitive";
import { useAuth } from "~/providers/auth-provider";
import { getUserFromRequest } from "~/lib/.server/authentication/get-user-from-request";

export const loader: LoaderFunction = async ({ request }) => {
  const userData = await getUserFromRequest(request);

  if (!userData) {
    return redirect("/"); // Redirect if no token is found
  }

  const user = await userData;

  // Add other data you want to include in the loader
  const someOtherData = {
    message: "This is additional data from the profile loader",
  };

  return {
    user,
    ...someOtherData,
  };
};

export default function MyProfile() {
  const { user, message }: any = useLoaderData();
  const { email, fullName, photo } = user || {};
  const { logout } = useAuth();

  return (
    <div className="p-10 text-wrap space-y-4 flex flex-col items-center pt-32">
      {photo && (
        <img
          src={photo}
          alt="User profile"
          className="rounded-full w-32 h-32"
        />
      )}
      {fullName ? (
        <p className="text-xl font-bold">{fullName}</p>
      ) : (
        <p>Not logged in</p>
      )}
      <p>{email}</p>
      <p className=" bg-gray-200 rounded p-2">{message}</p>
      {fullName ? <Button onClick={logout}>Logout</Button> : <AuthModal />}
    </div>
  );
}
