import { cn } from "~/lib/utils";
import { StepDotCurrent, StepDotDone, StepDotTodo } from "./form-nav.component";

// Static progress steps for confirmation
const progressSteps = [
  { label: "Volunteer Application Complete", state: "done" },
  { label: "Our team is re-viewing", state: "current" },
  { label: "One on One Conversation", state: "todo" },
];

export const ResultsProgressBar = () => {
  return (
    <div className="flex items-center justify-center my-12 w-full max-w-4xl">
      <ol role="list" className="grid grid-cols-3 items-start w-full mx-auto">
        {progressSteps.map((step, stepIdx) => {
          let DotComponent: React.FC;
          if (step.state === "done") {
            DotComponent = StepDotDone;
          } else if (step.state === "current") {
            DotComponent = StepDotCurrent;
          } else {
            DotComponent = StepDotTodo;
          }
          return (
            <li
              key={step.label}
              className="flex flex-col items-center relative "
            >
              <div className="relative z-10">
                <DotComponent />
              </div>
              {stepIdx !== progressSteps.length - 1 && (
                <div
                  className="absolute top-[18px] left-[55%] w-[90%] h-0.5"
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      "h-full",
                      step.state === "done"
                        ? "bg-ocean animate-grow-line-from-left"
                        : "bg-gray-200"
                    )}
                    style={{ width: "100%" }}
                  />
                </div>
              )}
              <span
                className={cn(
                  "mt-3 w-full text-center text-sm md:text-base font-bold max-w-40 lg:max-w-none",
                  "lg:whitespace-nowrap lg:text-lg"
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
