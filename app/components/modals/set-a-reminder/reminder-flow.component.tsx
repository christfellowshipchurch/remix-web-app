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

  // English flow for setting a reminder
  let renderStep = () => {
    switch (step) {
      case ReminderStep.REMINDER:
        return (
          <ReminderForm onSuccess={() => setStep(ReminderStep.CONFIRMATION)} />
        );
      case ReminderStep.CONFIRMATION:
        return <ReminderConfirmation onSuccess={() => setOpenModal(false)} />;
      default:
        return null;
    }
  };

  // TODO: Implement Spanish flow for setting a reminder
  // if (isEspanol) {
  // }

  return (
    <div className="text-center text-text_primary px-8 overflow-auto w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-[50vw]">
      {renderStep()}
    </div>
  );
};

export default ReminderFlow;
