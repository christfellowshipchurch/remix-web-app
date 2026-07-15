import { Button } from '~/primitives/button/button.primitive';

interface CookieConsentProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

// Presentational banner. Visibility and consent storage are owned by
// CookieConsentProvider so the "Cookie Settings" link can re-open it.
export function CookieConsent({
  isOpen,
  onAccept,
  onDecline,
}: CookieConsentProps) {
  if (!isOpen) return null;

  return (
    <div
      role='dialog'
      aria-labelledby='cookie-consent-title'
      className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-50'
    >
      <div className='max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex-1'>
            <h2
              id='cookie-consent-title'
              className='text-base font-semibold text-gray-900'
            >
              Cookie Settings
            </h2>
            <p className='mt-1 text-sm text-gray-600'>
              We use cookies to enhance your browsing experience and analyze our
              traffic. You can choose to accept or decline these cookies.
            </p>
          </div>
          <div className='flex gap-3'>
            <Button onClick={onDecline} intent='secondary' size='sm'>
              Decline
            </Button>
            <Button onClick={onAccept} intent='primary' size='sm'>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
