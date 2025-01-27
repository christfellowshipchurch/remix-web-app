import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { AuthProvider } from "./providers/auth-provider";

export { ErrorBoundary } from "./error";

export default function App() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="../app/styles/tailwind.css" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
