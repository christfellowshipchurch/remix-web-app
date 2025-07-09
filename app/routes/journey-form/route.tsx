import { Outlet } from "react-router-dom";
import React from "react";
import { cn } from "~/lib/utils";

// Step 1: Form
// Step 2: Confirmation

export const JourneyFormRoute: React.FC = () => {
  return (
    <div className={cn("min-h-screen flex flex-col bg-ocean")}>
      <main className="flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default JourneyFormRoute;
