import { cn } from "~/lib/utils";
import React from "react";
import Icon from "~/primitives/icon";

const stepsData = [
  { id: "about-you", name: "About You" },
  { id: "availability", name: "Availability" },
  { id: "interests", name: "Interests" },
];

// Step Dot Components
export const StepDotDone: React.FC = () => (
  <div className="flex p-1 items-center justify-center rounded-full bg-ocean">
    <Icon name="check" className="text-white" />
  </div>
);

export const StepDotCurrent: React.FC = () => (
  <>
    <div
      className={cn(
        "absolute size-[34px] bg-ocean rounded-full",
        "animate-[ping_500ms_ease-in_1_forwards_500ms]"
      )}
    />
    <div className="flex p-[3px] items-center justify-center rounded-full bg-white border-2 border-ocean ring-5 ring-ocean/30 -mb-[2px]">
      <Icon name="check" className="text-ocean" />
    </div>
  </>
);

export const StepDotTodo: React.FC = () => (
  <div className="flex p-3 items-center justify-center rounded-full -mb-[8px]">
    <div className="size-4 rounded-full bg-ocean/50" />
  </div>
);

export const VolunteerFormNav: React.FC<{ currentStepId: string }> = ({
  currentStepId,
}) => {
  const currentStepIndex = stepsData.findIndex(
    (step) => step.id === currentStepId
  );

  return (
    <div className="w-full bg-gray px-4 pt-12 pb-8 sm:px-6 lg:px-8 sticky top-0 z-50">
      <nav aria-label="Progress">
        <ol
          role="list"
          className="flex items-start justify-between w-full max-w-3xl mx-auto"
        >
          {stepsData.map((step, stepIdx) => {
            // Determine which dot component to render based on the step index
            let DotComponent: React.FC;
            if (stepIdx < currentStepIndex) {
              DotComponent = StepDotDone;
            } else if (stepIdx === currentStepIndex) {
              DotComponent = StepDotCurrent;
            } else {
              DotComponent = StepDotTodo;
            }
            return (
              <li
                key={step.name}
                className="flex flex-col items-center relative flex-1"
              >
                <div className="relative z-10">
                  <DotComponent />
                </div>
                {stepIdx !== stepsData.length - 1 && (
                  <div
                    className="absolute top-1/4 left-1/2 w-full h-0.5"
                    aria-hidden="true"
                  >
                    <div
                      className={cn(
                        "h-full",
                        stepIdx < currentStepIndex
                          ? "bg-ocean animate-grow-line-from-left"
                          : "bg-gray-200"
                      )}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                <a
                  href={`/volunteer-form/${step.id}`}
                  className="mt-3 whitespace-nowrap text-center text-lg font-bold hover:text-ocean transition-colors"
                >
                  {step.name}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
