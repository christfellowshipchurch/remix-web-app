import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';

interface PrayerRequestConfirmationProps {
  firstName: string;
  onAddAnother: () => void;
  onSuccess: () => void;
}

const PrayerRequestConfirmation: React.FC<PrayerRequestConfirmationProps> = ({
  firstName,
  onAddAnother,
  onSuccess,
}) => {
  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <Icon name='check' size={64} color='#1ec27f' />
      <h1 className='font-bold text-2xl text-navy'>
        Thank you {firstName} for allowing us to pray with you.
      </h1>
      <Button
        intent='primary'
        className='rounded-xl w-64'
        onClick={onAddAnother}
      >
        Add Another Prayer Request
      </Button>
      <Button intent='primary' className='rounded-xl w-52' onClick={onSuccess}>
        Continue
      </Button>
    </div>
  );
};

export default PrayerRequestConfirmation;
