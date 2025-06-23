import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { cn } from "~/lib/utils";
import { VolunteerFormNav } from "~/routes/volunteer-form/components/volunteer-form-nav.component";

// Step 1: Welcome
// Step 2: Personal Info
// Step 3: Availability
// Step 4: Preferences
// Step 5: Confirmation/Results

export const VolunteerFormRoute: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const currentStep = pathSegments[pathSegments.length - 1];
  const isWelcomeStep = currentStep === "welcome";
  const isFormPage = ["personal-info", "availability", "preferences"].includes(
    currentStep
  );

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        isWelcomeStep ? "bg-navy" : "bg-white"
      )}
    >
      {isFormPage && <VolunteerFormNav currentStepId={currentStep} />}
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

export default VolunteerFormRoute;
