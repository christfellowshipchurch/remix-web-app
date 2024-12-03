import { useState } from "react";
import ReminderConfirmation from "./confirmation.component";
import ReminderForm from "./reminder-form.component";

interface ReminderFlowProps {
  setOpenModal: (open: boolean) => void;
}

enum ReminderStep {
  REMINDER,
  CONFIRMATION,
}

const ReminderFlow: React.FC<ReminderFlowProps> = ({ setOpenModal }) => {
  const [step, setStep] = useState<ReminderStep>(ReminderStep.REMINDER);
  const [serviceTime, setServiceTime] = useState<string>("");

  let renderStep = () => {
    switch (step) {
      case ReminderStep.REMINDER:
        return (
          <ReminderForm
            setServiceTime={setServiceTime}
            onSuccess={() => setStep(ReminderStep.CONFIRMATION)}
          />
        );
      case ReminderStep.CONFIRMATION:
        return (
          <ReminderConfirmation
            serviceTime={serviceTime}
            onSuccess={() => setOpenModal(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-center text-text_primary px-8 overflow-auto w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-[60vw]">
      {renderStep()}
    </div>
  );
};

export default ReminderFlow;
