import { useState } from "react";
import ConnectCardConfirmation from "./confirmation.component";
import ConnectCardForm from "./connect-form.component";
import { ConnectCardLoaderReturnType } from "~/routes/connect-card/types";

enum ConnectCardStep {
  CONNECT_CARD,
  CONFIRMATION,
}

const ConnectCardFlow: React.FC<ConnectCardLoaderReturnType> = (data) => {
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
        return <ConnectCardConfirmation />;
      default:
        return null;
    }
  };

  return (
    <div className="text-center text-text_primary px-8 overflow-auto w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-[50vw]">
      {renderStep()}
    </div>
  );
};

export default ConnectCardFlow;
