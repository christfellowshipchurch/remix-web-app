import { useState } from 'react';
import GroupFinderNotifyConfirmation from './confirmation.component';
import GroupFinderNotifyForm from './group-finder-notify-form.component';

enum GroupFinderNotifyStep {
  FORM,
  CONFIRMATION,
}

const GroupFinderNotifyFlow = ({
  setOpenModal,
}: {
  setOpenModal: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<GroupFinderNotifyStep>(
    GroupFinderNotifyStep.FORM,
  );

  const renderStep = () => {
    switch (step) {
      case GroupFinderNotifyStep.FORM:
        return (
          <GroupFinderNotifyForm
            onSuccess={() => setStep(GroupFinderNotifyStep.CONFIRMATION)}
          />
        );
      case GroupFinderNotifyStep.CONFIRMATION:
        return (
          <GroupFinderNotifyConfirmation
            onSuccess={() => setOpenModal(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='pt-10 text-center text-text_primary p-6 w-[90vw] max-w-sm md:max-w-xl overflow-y-scroll max-h-[85vh] md:max-h-[90vh]'>
      {renderStep()}
    </div>
  );
};

export default GroupFinderNotifyFlow;
