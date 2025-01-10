import { useState } from "react";
import GroupContactConfirmation from "./contact-confirmation.component";
import GroupContactForm from "./contact-form.component";

enum ContactFormStep {
  CONTACT_FORM,
  CONFIRMATION,
}

const GroupContactFlow = ({
  setOpenModal,
  groupName,
}: {
  setOpenModal: (open: boolean) => void;
  groupName: string;
}) => {
  const [step, setStep] = useState<ContactFormStep>(
    ContactFormStep.CONTACT_FORM
  );

  const renderStep = () => {
    switch (step) {
      case ContactFormStep.CONTACT_FORM:
        return (
          <GroupContactForm
            onSuccess={() => setStep(ContactFormStep.CONFIRMATION)}
            groupName={groupName}
          />
        );
      case ContactFormStep.CONFIRMATION:
        return (
          <GroupContactConfirmation onSuccess={() => setOpenModal(false)} />
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

export default GroupContactFlow;
