import JourneyFinderSignUpConfirmation from '~/components/modals/journey-finder-sign-up/confirmation.component';

interface DreamTeamKickoffConfirmationProps {
  onSuccess?: () => void;
  onContinue?: () => void;
  buttonText?: string;
  calendarTitle?: string;
  details?: {
    title: string;
    campus: string;
    date: string;
    time: string;
    name: string;
  };
}

const DreamTeamKickoffConfirmation: React.FC<
  DreamTeamKickoffConfirmationProps
> = ({ onSuccess, onContinue, buttonText, calendarTitle, details }) => {
  return (
    <JourneyFinderSignUpConfirmation
      onSuccess={onSuccess}
      onContinue={onContinue}
      buttonText={buttonText}
      calendarTitle={calendarTitle}
      details={details}
    />
  );
};

export default DreamTeamKickoffConfirmation;
