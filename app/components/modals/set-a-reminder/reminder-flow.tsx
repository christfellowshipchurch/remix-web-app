import { useState } from "react";
import ReminderConfirmation from "./confirmation";
import Reminder from "./reminder";

interface ReminderFlowProps {
  isEspanol?: boolean;
  setOpenModal: (open: boolean) => void;
}

enum ReminderStep {
  REMINDER,
  CONFIRMATION,
}

const ReminderFlow: React.FC<ReminderFlowProps> = ({ setOpenModal }) => {
  const [step, setStep] = useState<ReminderStep>(ReminderStep.REMINDER);

  const handleReminderSubmit = async (reminderInput: string): Promise<void> => {
    if (reminderInput === "Reminder") {
      setStep(ReminderStep.CONFIRMATION);
    }
  };

  // English flow for setting a reminder
  const renderStep = () => {
    switch (step) {
      case ReminderStep.REMINDER:
        return <Reminder onSubmit={handleReminderSubmit} />;
      case ReminderStep.CONFIRMATION:
        return <ReminderConfirmation />;
      default:
        return null;
    }
  };

  // TODO: Spanish flow for setting a reminder

  return (
    <div className="text-center text-text_primary px-8 overflow-auto w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-[50vw]">
      {renderStep()}
    </div>
  );
};

export default ReminderFlow;
