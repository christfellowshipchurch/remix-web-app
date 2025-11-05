import { useState } from "react";
// import { icons } from "~/lib/icons";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

// TODO: This component is pending some more thought and work around registering for events since it can very a lot per event

export const ClickThroughRegistration = ({ title }: { title: string }) => {
  const [step, setStep] = useState(1);
  // const [_selectedCampus, _setSelectedCampus] = useState("Select Campus");
  // const [_selectedDate, _setSelectedDate] = useState("Select a Date");
  // const [_selectedTime, _setSelectedTime] = useState("Select a Time");

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getCurrentStepData = () => {
    return StepsData.find((data) => data.step === step) || StepsData[0];
  };

  return (
    <section
      className="flex items-center w-full py-8 md:py-16 content-padding bg-gray"
      id="register"
    >
      <div className="w-full max-w-3xl flex flex-col gap-13 mx-auto">
        <div className="flex flex-col gap-4">
          <h2 className="font-extrabold text-center text-black text-[32px]">
            Register for {title}
          </h2>
          <p className="text-center text-[#717182] text-lg font-medium md:mx-4">
            Ready to take the next step? Complete our four-step registration
            process to secure your spot.
          </p>
        </div>

        {/* From here down will change based on step */}
        <div className="flex flex-col gap-3">
          {/* Top */}
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-4">
              {step > 1 && (
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleBack}
                >
                  <Icon name="chevronLeft" size={16} className="text-black" />
                  <p className="text-xs font-semibold text-[#616161]">Back</p>
                </div>
              )}
              <h3 className="text-xl font-bold text-black">
                {getCurrentStepData().title}
              </h3>
            </div>

            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4].map((dotStep) => (
                <div
                  key={dotStep}
                  className={`${
                    dotStep <= step ? "bg-ocean" : "bg-[#AEAEAE]"
                  } size-[10px] rounded-full`}
                />
              ))}
            </div>

            <p className="text-black font-semibold text-sm">Step {step} of 4</p>
          </div>

          {/* Bot - empty for now*/}
          <div>
            <Button
              intent="primary"
              onClick={handleContinue}
              disabled={step === 4}
            >
              {step === 4 ? "Complete" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// WORK IN PROGRESS - THIS IS NOT COMPLETE
// const _SelectedBar = ({
//   icon,
//   text,
// }: {
//   icon: keyof typeof icons;
//   text: string;
// }) => {
//   return (
//     <div className="flex gap-2">
//       <Icon name={icon} />
//       <p>{text}</p>
//     </div>
//   );
// };

// const _ClickableCard = () => {
//   return (
//     <div>
//       <div></div>
//     </div>
//   );
// };

const StepsData = [
  { step: 1, title: "Choose Your Campus" },
  { step: 2, title: "Select the Date" },
  { step: 3, title: "Pick Your Time" },
  { step: 4, title: "Personal Information" },
];
