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
      calendarDescription='We are so excited for you to take your next step in your faith!'
      details={details}
    />
  );
};

export default BaptismSignUpConfirmation;
