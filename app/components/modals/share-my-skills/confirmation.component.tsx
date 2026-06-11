import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';

interface ShareMySkillsConfirmationProps {
  onSuccess?: () => void;
}

const ShareMySkillsConfirmation: React.FC<ShareMySkillsConfirmationProps> = ({
  onSuccess,
}) => {
  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <Icon name='check' size={64} color='#1ec27f' />
      <h1 className='font-bold text-2xl text-navy'>Skills Received!</h1>
      <p className='text-center text-text_primary'>
        Thank you for sharing your unique skills and experiences. We'll reach
        out when opportunities arise that match what you have to offer.
      </p>
      <Button
        intent='primary'
        className='rounded-xl w-52'
        onClick={onSuccess}
      >
        Continue
      </Button>
    </div>
  );
};

export default ShareMySkillsConfirmation;
