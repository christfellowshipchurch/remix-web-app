import {
  Outlet,
  useLocation,
  LoaderFunction,
  redirect,
} from "react-router-dom";
import React from "react";
import { cn } from "~/lib/utils";

// Step 1: Welcome
// Step 2: Personal Info
// Step 3: 21 Day Devotional

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  // If the path is exactly /yes (no trailing slash or anything after)
  if (url.pathname === "/yes") {
    return redirect("/yes/welcome");
  }
  return null;
};

export const YesRoute: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const currentStep = pathSegments[pathSegments.length - 1];
  const isWelcomeStep = currentStep === "welcome";

  return (
    <div className={cn("min-h-screen flex flex-col", "bg-ocean")}>
      <main
        className={cn(
          "flex flex-col items-center",
          isWelcomeStep && "justify-center"
        )}
      >
        {/* Render the current step */}
        <Outlet />
      </main>
    </div>
  );
};

export default YesRoute;
