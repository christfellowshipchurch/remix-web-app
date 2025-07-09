import { Outlet, useLocation } from "react-router-dom";
import React from "react";
import { cn } from "~/lib/utils";

// Step 1: Welcome
// Step 2: Personal Info
// Step 3: 21 Day Devotional

export const YesRoute: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const currentStep = pathSegments[pathSegments.length - 1];
  const isWelcomeStep = currentStep === "welcome";

  return (
    <div className={cn("min-h-screen flex flex-col", "bg-ocean")}>
      <main
        className={cn(
          "flex-1 flex flex-col items-center",
          isWelcomeStep && "justify-center"
        )}
      >
        {/* Render the current step */}
        <Outlet />
      </main>
      {/* TODO: Add footer if needed */}
    </div>
  );
};

export default YesRoute;
