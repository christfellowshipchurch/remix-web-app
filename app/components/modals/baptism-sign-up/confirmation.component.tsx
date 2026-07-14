import JourneyFinderSignUpConfirmation from '~/components/modals/journey-finder-sign-up/confirmation.component';

interface BaptismSignUpConfirmationProps {
  onSuccess?: () => void;
  onContinue?: () => void;
  buttonText?: string;
  details?: {
    title: string;
    campus: string;
    date: string;
    time: string;
    name: string;
  };
}

const BaptismSignUpConfirmation: React.FC<BaptismSignUpConfirmationProps> = ({
  onSuccess,
  onContinue,
  buttonText,
  details,
}) => {
  return (
    <JourneyFinderSignUpConfirmation
      onSuccess={onSuccess}
      onContinue={onContinue}
      buttonText={buttonText}
      calendarTitle='Baptism at Christ Fellowship Church'
      details={details}
    />
  );
};

export default BaptismSignUpConfirmation;
