import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';

interface NewsletterSubscriptionConfirmationProps {
  onSuccess: () => void;
}

const NewsletterSubscriptionConfirmation: React.FC<
  NewsletterSubscriptionConfirmationProps
> = ({ onSuccess }) => {
  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <Icon name='check' size={64} color='#1ec27f' />
      <h1 className='font-bold text-2xl text-navy'>You're subscribed!</h1>
      <Button intent='primary' className='rounded-xl w-52' onClick={onSuccess}>
        Continue
      </Button>
    </div>
  );
};

export default NewsletterSubscriptionConfirmation;
