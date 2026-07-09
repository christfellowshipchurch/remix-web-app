import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConnectCardForm from '~/components/modals/connect-card/connect-form.component';
import ConnectCardConfirmation from '~/components/modals/connect-card/confirmation.component';
import {
  translatePageToSpanish,
  resetPageTranslation,
} from '~/lib/google-translate';

export { action } from './action';
export { loader } from './loader';
export { meta } from './meta';

export default function ConnectCardFormPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang');

  // Spanish campus CTAs link here with ?lang=es (see connect-card-modal.tsx).
  // Revert on leaving — this is an SPA, so without a reset the translation
  // would otherwise silently carry over to whatever page the visitor goes
  // to next. Keyed on `lang` (not the whole searchParams object) so this
  // doesn't fire when unrelated params change, e.g. the rckipid/rckpid
  // prefill params getting stripped from the URL while still on this page.
  useEffect(() => {
    if (lang !== 'es') return;
    translatePageToSpanish();
    return () => resetPageTranslation();
  }, [lang]);

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
