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
    <div className="text-center text-text_primary p-8 overflow-auto w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-[85vw] 2xl:w-[60vw]">
      {renderStep()}
    </div>
  );
};

export default ConnectCardFlow;
