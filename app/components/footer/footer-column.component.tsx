import type { FooterColumn } from './footer-data';
import {
  ConnectCardModal,
  NewsletterSubscriptionModal,
  PrayerRequestModal,
} from '~/components';
import { useCookieConsent } from '~/providers/cookie-consent-provider';

interface FooterColumnProps {
  column: FooterColumn;
}

const footerActionButtonClassName =
  'text-lg font-light text-coconut m-0 p-0 border-0 rounded-none bg-transparent items-start justify-start min-h-0 min-w-0 hover:enabled:bg-transparent hover:cursor-pointer hover:text-white/50';

export const FooterColumnComponent = ({ column }: FooterColumnProps) => {
  const { openConsent } = useCookieConsent();

  return (
    <div className='flex flex-col gap-3 md:col-span-4 lg:col-span-1'>
      <div
        className='text-2xl text-white font-bold'
        role='heading'
        aria-level={2}
      >
        {column.title}
      </div>
      {column.links.map((link) =>
        link.url === '#connect-card' ? (
          <ConnectCardModal
            key={link.title}
            triggerStyles={footerActionButtonClassName}
            buttonTitle={link.title}
          />
        ) : link.url === '#prayer-request' ? (
          <PrayerRequestModal
            key={link.title}
            triggerStyles={footerActionButtonClassName}
            buttonTitle={link.title}
          />
        ) : link.url === '#newsletter-subscription' ? (
          <NewsletterSubscriptionModal
            key={link.title}
            triggerStyles={footerActionButtonClassName}
            buttonTitle={link.title}
          />
        ) : link.url === '#cookie-settings' ? (
          <button
            key={link.title}
            type='button'
            className='text-lg text-left hover:text-white/50 transition-colors cursor-pointer'
            onClick={openConsent}
            aria-label={`${link.title}`}
          >
            {link.title}
          </button>
        ) : (
          <a
            key={link.title}
            className='text-lg hover:text-white/50 transition-colors'
            href={link.url}
            aria-label={`${link.title} Link`}
          >
            {link.title}
          </a>
        ),
      )}
    </div>
  );
};
