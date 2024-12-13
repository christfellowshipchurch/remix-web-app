import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import Navbar from "./components/navbar";
import { AuthProvider } from "./providers/auth-provider";

export { ErrorBoundary } from "./error";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Moved tailwind import here to support SSR better */}
        <link rel="stylesheet" href="../app/styles/tailwind.css" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <AuthProvider>{children}</AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
