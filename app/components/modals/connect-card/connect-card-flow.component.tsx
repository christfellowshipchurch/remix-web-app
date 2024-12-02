import { useState } from "react";
import ConnectCardConfirmation from "./confirmation.component";
import ConnectCardForm from "./connect-form.component";
import { ConnectCardLoaderReturnType } from "~/routes/connect-card/types";

enum ConnectCardStep {
  CONNECT_CARD,
  CONFIRMATION,
}

const ConnectCardFlow = ({
  data,
  setOpenModal,
}: {
  data: ConnectCardLoaderReturnType;
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
            formFieldData={data}
            onSuccess={() => setStep(ConnectCardStep.CONFIRMATION)}
          />
        );
      case ConnectCardStep.CONFIRMATION:
        return (
          <ConnectCardConfirmation
            // Close modal on success
            onSuccess={() => setOpenModal(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-center text-text_primary px-8 overflow-auto w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-full md:max-w-[55vw]">
      {renderStep()}
    </div>
  );
};

export default ConnectCardFlow;
