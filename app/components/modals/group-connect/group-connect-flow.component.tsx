import { useState } from "react";
import GroupConnectConfirmation from "./group-connect-confirmation.component";
import GroupConnectForm from "./group-connect-form.component";

enum GroupConnectStep {
  GROUP_CONNECT_FORM,
  GROUP_CONNECT_CONFIRMATION,
}

interface GroupConnectFlowProps {
  setOpenModal: (open: boolean) => void;
  groupId: string;
  campus?: string;
}

const GroupConnectFlow = ({
  setOpenModal,
  groupId,
  campus,
}: GroupConnectFlowProps) => {
  const [step, setStep] = useState<GroupConnectStep>(
    GroupConnectStep.GROUP_CONNECT_FORM,
  );

  const renderStep = () => {
    switch (step) {
      case GroupConnectStep.GROUP_CONNECT_FORM:
        return (
          <GroupConnectForm
            onSuccess={() =>
              setStep(GroupConnectStep.GROUP_CONNECT_CONFIRMATION)
            }
            groupId={groupId}
            campus={campus}
          />
        );
      case GroupConnectStep.GROUP_CONNECT_CONFIRMATION:
        return (
          <GroupConnectConfirmation onSuccess={() => setOpenModal(false)} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-center text-text_primary p-6 md:p-10 overflow-auto overflow-x-hidden w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-full">
      {renderStep()}
    </div>
  );
};

export default GroupConnectFlow;
