import { appleLink, cn, googleLink } from '~/lib/utils';
import HTMLRenderer from '~/primitives/html-renderer';
import { Icon } from '~/primitives/icon/icon';

export function DownloadAppSection({ isSpanish }: { isSpanish?: boolean }) {
  return (
    <>
      <DesktopVersion isSpanish={isSpanish} />
      <MobileVersion isSpanish={isSpanish} />
    </>
  );
}

const DesktopVersion = ({ isSpanish }: { isSpanish?: boolean }) => {
  const copy = isSpanish ? spanishCopy : englishCopy;

  return (
    <section
      className={cn(
        'bg-linear-to-b from-dark-navy via-50% via-dark-navy to-navy content-padding w-full py-28 hidden md:block relative z-30',
      )}
    >
      <div
        className={cn(
          'max-w-screen-content mx-auto flex justify-center gap-8 lg:gap-16 items-center flex-row-reverse',
        )}
      >
        <div className='flex flex-col gap-16 text-white'>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-4'>
              <h2 className='text-white text-[40px] leading-tight'>
                <HTMLRenderer html={copy.title as string} />
              </h2>
              <p className='text-lg'>{copy.subtitle}</p>
            </div>
            <p className='max-w-[490px]'>{copy.summary}</p>
          </div>

          <DownloadAppButtons />
        </div>

        <div className='flex justify-center items-center'>
          <img
            src='/assets/images/home/app-left.webp'
            alt='Christ Fellowship App on a phone'
            width={696}
            height={1774}
            className={cn('w-full aspect-9/21 max-w-[220px]')}
          />
        </div>
      </div>
    </section>
  );
};

const MobileVersion = ({ isSpanish }: { isSpanish?: boolean }) => {
  const copy = isSpanish ? spanishCopy : englishCopy;

  return (
    <section
      className={cn(
        'bg-linear-to-b from-dark-navy via-50% via-dark-navy to-navy content-padding w-full py-16 md:hidden relative z-30',
      )}
    >
      <div className='max-w-screen-content mx-auto flex flex-col gap-8 items-center'>
        <h2
          className={cn(
            'text-white text-center text-[32px] leading-tight max-w-[340px]',
          )}
        >
          <HTMLRenderer html={copy.title as string} />
        </h2>

        <div className='flex justify-center items-center'>
          <img
            src='/assets/images/home/app-left.webp'
            alt='Christ Fellowship App on a phone'
            width={696}
            height={1774}
            className={cn('w-[50vw]', 'aspect-9/21', 'max-w-[140px]')}
          />
        </div>

        <p className='text-white text-center leading-tight max-w-[420px]'>
          {copy.summary}
        </p>

        <DownloadAppButtons />
      </div>
    </section>
  );
};

const DownloadAppButtons = () => {
  return (
    <div className='flex flex-row gap-3 flex-wrap justify-center md:justify-start'>
      <StoreButton
        href={appleLink}
        eyebrow='Download on the'
        storeName='App Store'
        iconName='appleLogo'
        ariaLabel='Download on the App Store'
      />
      <StoreButton
        href={googleLink}
        eyebrow='Get it on'
        storeName='Google Play'
        iconName='google'
        ariaLabel='Get it on Google Play'
      />
    </div>
  );
};

const StoreButton = ({
  href,
  eyebrow,
  storeName,
  iconName,
  ariaLabel,
}: {
  href: string;
  eyebrow: string;
  storeName: string;
  iconName: 'appleLogo' | 'google';
  ariaLabel: string;
}) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-3',
        'bg-navy text-white',
        'rounded-full px-6 py-3',
        'hover:bg-navy/50 transition-colors duration-200',
        'min-w-[170px]',
        'shadow-lg',
        'border border-white/10',
      )}
    >
      <Icon name={iconName} size={40} className='flex-shrink-0' />
      <div className='flex flex-col leading-tight'>
        <span className='text-[10px] uppercase tracking-widest opacity-80'>
          {eyebrow}
        </span>
        <span className='text-[20px] font-semibold'>{storeName}</span>
      </div>
    </a>
  );
};

const spanishCopy = {
  title: `Crece en <strong>tu fe. <br/> Cada día</strong> de la semana.`,
  summary:
    'La experiencia de la app de la Christ Fellowship fue diseñada para ayudarte a crecer en tu fe cada día de la semana. A través de sus características, puedes mantenerte consistente en tu tiempo con Dios.',
  subtitle: 'Descarga la app de la Christ Fellowship',
};

const englishCopy = {
  title: `Grow in your <strong>faith. <br /> Every day</strong> of the week.`,
  summary:
    'The Christ Fellowship App experience was designed to help you grow in your faith every day of the week. Through its features, you can stay consistent in your time with God.',
  subtitle: 'Download the Christ Fellowship Church App',
};
