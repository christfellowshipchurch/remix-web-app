import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConnectCardForm from '~/components/modals/connect-card/connect-form.component';
import ConnectCardConfirmation from '~/components/modals/connect-card/confirmation.component';
import { translatePageToSpanish } from '~/lib/google-translate';

export { action } from './action';
export { loader } from './loader';
export { meta } from './meta';

export default function ConnectCardFormPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();

  // Spanish campus CTAs link here with ?lang=es (see connect-card-modal.tsx).
  useEffect(() => {
    if (searchParams.get('lang') === 'es') translatePageToSpanish();
  }, [searchParams]);

  return (
    <div className='flex flex-col items-center justify-center px-6 py-12 md:py-20 max-w-screen-sm mx-auto'>
      {isSuccess ? (
        <ConnectCardConfirmation />
      ) : (
        <ConnectCardForm onSuccess={() => setIsSuccess(true)} />
      )}
    </div>
  );
}
