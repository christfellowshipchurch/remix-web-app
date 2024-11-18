import { useState } from "react";
import ConnectCard from "./card";
import ConnectCardConfirmation from "./confirmation";

interface ConnectCardFlowProps {
  setOpenModal: (open: boolean) => void;
}

enum ConnectCardStep {
  CONNECT_CARD,
  CONFIRMATION,
}

const ConnectCardFlow: React.FC<ConnectCardFlowProps> = ({ setOpenModal }) => {
  const [step, setStep] = useState<ConnectCardStep>(
    ConnectCardStep.CONNECT_CARD
  );

  const handleConnectSubmit = async (connectInput: string): Promise<void> => {
    if (connectInput === "Connect") {
      setStep(ConnectCardStep.CONFIRMATION);
    }
  };

  const renderStep = () => {
    switch (step) {
      case ConnectCardStep.CONNECT_CARD:
        return <ConnectCard onSubmit={handleConnectSubmit} />;
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
