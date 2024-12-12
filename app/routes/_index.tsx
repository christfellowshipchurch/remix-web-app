import type { LoaderFunction, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import AuthModal from "~/components/modals/auth";
import { getUserFromRequest } from "~/lib/.server/authentication/getUserFromRequest";
import Button from "~/primitives/button";
import { useAuth, User } from "~/providers/auth-provider";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

/** Example of how to return current user via sever-side */
export const loader: LoaderFunction = async ({ request }) => {
  const userData = await getUserFromRequest(request);

  if (!userData) {
    return null; // here you can redirect to a login page etc.
  }

  return userData;
};

export default function Index() {
  const userData: User | null = useLoaderData(); // Get logged in user data server-side
  const [user, setUser] = useState<User | null>(null);
  const { logout, isLoading } = useAuth();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome <i>{user ? user.fullName : null}</i> to
            <span className="sr-only">Christ Fellowship Church</span>
          </h1>
          <img width={200} src="/logo.png" alt="CF Logo" />
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            What&apos;s next?
          </p>
          <Button href="/articles/10-ways-to-be-generous">
            Check out a new Article
          </Button>
          {isLoading ? (
            <>Loading...</>
          ) : user ? (
            <>
              <Button intent={"secondary"} onClick={logout}>
                Logout
              </Button>
              <a className="text-ocean underline" href="/profile">
                Go to Profile
              </a>
            </>
          ) : (
            <AuthModal />
          )}
        </nav>
      </div>
    </div>
  );
}
