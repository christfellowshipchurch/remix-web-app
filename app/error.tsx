/** Root Error Boundary */
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6">
          ⚠ {error.status} {error.statusText}
        </h1>
        <p className="text-lg italic">{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6">Error</h1>
        <p className="text-lg italic">{error.message}</p>
        <p className="text-lg font-bold mt-10">The stack trace is:</p>
        <pre className="text-wrap mx-10">{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
