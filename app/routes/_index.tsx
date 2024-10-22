import type { MetaFunction } from "@remix-run/node";
import AuthModal from "~/components/modals/auth";
import Button from "~/primitives/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Christ Fellowship Church</span>
          </h1>
          <img width={200} src="/logo.png" alt="CF Logo" />
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            What&apos;s next?
          </p>
          <Button href="/articles/10-ways-to-be-generous">
            Check the Articles
          </Button>
          <AuthModal />
        </nav>
      </div>
    </div>
  );
}
