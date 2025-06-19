import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { cn } from "~/lib/utils";

// Step 1: Welcome
// Step 2: Personal Info
// Step 3: Availability
// Step 4: Preferences
// Step 5: Confirmation/Results

export const VolunteerFormRoute: React.FC = () => {
  const location = useLocation();
  const currentStep = location.pathname.split("/").pop();
  const isWelcomeStep = currentStep === "welcome";

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        isWelcomeStep ? "bg-navy" : "bg-white"
      )}
    >
      {/* TODO: Add header/navigation for steps */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Render the current step */}
        <Outlet />
      </main>
      {/* TODO: Add footer if needed */}
    </div>
  );
};

export default VolunteerFormRoute;
