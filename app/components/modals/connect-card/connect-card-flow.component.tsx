import { useState } from "react";
import ConnectCardConfirmation from "./confirmation.component";
import ConnectCardForm from "./connect-form.component";

enum ConnectCardStep {
  CONNECT_CARD,
  CONFIRMATION,
}

const ConnectCardFlow = ({
  setOpenModal,
}: {
  setOpenModal: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<ConnectCardStep>(
    ConnectCardStep.CONNECT_CARD
  );

  const renderStep = () => {
    switch (step) {
      case ConnectCardStep.CONNECT_CARD:
        return (
          <ConnectCardForm
            onSuccess={() => setStep(ConnectCardStep.CONFIRMATION)}
          />
        );
      case ConnectCardStep.CONFIRMATION:
        return (
          <ConnectCardConfirmation onSuccess={() => setOpenModal(false)} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-center text-text_primary p-6 w-screen max-w-sm md:max-w-xl lg:max-w-3xl overflow-y-scroll max-h-[85vh] md:max-h-[90vh]">
      {renderStep()}
    </div>
  );
};

export default ConnectCardFlow;
