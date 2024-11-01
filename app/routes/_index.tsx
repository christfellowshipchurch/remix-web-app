import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import AuthModal from "~/components/modals/auth";
import Button from "~/primitives/button";
import { useAuth, User } from "~/providers/auth-provider";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const fetcher = useFetcher();
  const [user, setUser] = useState<User | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    if (fetcher.state === "idle") {
      fetcher.load("/profile?redirect=false");
    }
  }, []);

  useEffect(() => {
    const data = fetcher.data as { message?: string } | User;
    if (data) {
      if ("message" in data && data.message === "Token not found!") {
        setUser(null);
      } else {
        setUser(data as User);
      }
    }
  }, [fetcher.data]);

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
          {user ? (
            <>
              <Button intent={"secondary"} onClick={logout}>
                Logout
              </Button>
              <a className="text-primary underline" href="/profile">
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
