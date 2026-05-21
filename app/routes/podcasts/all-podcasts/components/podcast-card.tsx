import type { PodcastShow } from '../../types';
import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';
import { getPodcastShowHref, hasValidHref } from '../../utils/podcast-links';
import { cn, getFirstSentence } from '~/lib/utils';

type PodcastCardProps = {
  podcast: PodcastShow;
  className?: string;
};

type PlatformLink = {
  label: string;
  icon: string;
  href: string;
};

function PodcastCoverImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'w-full aspect-video shrink-0 self-start overflow-hidden rounded-lg',
        className,
      )}
    >
      <img src={src} alt={alt} className='h-full w-full object-cover' />
    </div>
  );
}

function PlatformLinkButton({
  link,
  sizeClass,
  iconSize,
  labelClass,
}: {
  link: PlatformLink;
  sizeClass: string;
  iconSize: number;
  labelClass: string;
}) {
  return (
    <a
      href={link.href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={`${link.label} Link`}
      className={`flex flex-col items-center justify-center gap-1 bg-ocean rounded-lg ${sizeClass}`}
    >
      <Icon
        name={link.icon as keyof typeof import('~/lib/icons').icons}
        color='white'
        size={iconSize}
        className={link.icon === 'amazonMusic' ? '-mt-1' : ''}
      />
      <p
        className={`text-[7px] font-extrabold text-white ${labelClass} ${
          link.icon === 'amazonMusic' ? '-mt-2' : ''
        }`}
      >
        {link.label}
      </p>
    </a>
  );
}

export function PodcastHubCard({ podcast, className = '' }: PodcastCardProps) {
  const {
    title,
    description,
    apple,
    spotify,
    amazon,
    youtube,
    url,
    coverImage,
  } = podcast;

  const showHref = getPodcastShowHref(url);
  const descriptionPreview = getFirstSentence(description);

  const platformLinks: PlatformLink[] = [
    {
      label: 'Apple Music',
      icon: 'appleLogo',
      href: apple,
    },
    {
      label: 'Spotify',
      icon: 'spotify',
      href: spotify,
    },
    {
      label: 'Amazon Music',
      icon: 'amazonMusic',
      href: amazon,
    },
    {
      label: 'YouTube',
      icon: 'youtube',
      href: youtube,
    },
  ].filter((link) => hasValidHref(link.href));

  return (
    <div
      className={`flex relative overflow-hidden ${className} py-8 md:py-12 group w-full px-6 md:px-18`}
    >
      {/* Desktop */}
      <div className='hidden relative md:flex flex-col lg:flex-row gap-8 w-full max-w-screen-content mx-auto'>
        <PodcastCoverImage
          src={coverImage}
          alt={title}
          className={cn('max-w-[550px]', 'lg:w-[480px]', 'xl:w-[590px]')}
        />

        {/* Content */}
        <div className='flex flex-col justify-center gap-4'>
          <h3 className='text-[32px] font-extrabold'>{title}</h3>
          {descriptionPreview ? (
            <p className='text-xl text-[#767676] lg:max-w-[540px]'>
              {descriptionPreview}
            </p>
          ) : null}
          <div className='flex items-center gap-8 w-full'>
            {showHref ? (
              <Button intent='secondary' href={showHref} className='h-full'>
                Episodes and More
              </Button>
            ) : null}

            <div className='flex gap-2'>
              {platformLinks.map((link, index) => (
                <PlatformLinkButton
                  key={index}
                  link={link}
                  sizeClass='size-[54px]'
                  iconSize={link.icon === 'amazonMusic' ? 36 : 24}
                  labelClass=''
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className='relative w-full max-w-screen-content mx-auto md:hidden'>
        <div className='flex flex-col justify-center gap-4'>
          <div className='flex flex-col gap-4'>
            <h3 className='text-[32px] font-extrabold'>{title}</h3>
            {descriptionPreview ? (
              <p className='text-[#767676]'>{descriptionPreview}</p>
            ) : null}
            <PodcastCoverImage src={coverImage} alt={title} />
          </div>

          <div className='flex flex-col items-center gap-6 w-full'>
            {showHref ? (
              <Button
                intent='secondary'
                href={showHref}
                linkClassName='w-full'
                className='w-full'
              >
                Episodes and More
              </Button>
            ) : null}

            {platformLinks.length > 0 ? (
              <div className='flex gap-2'>
                {platformLinks.map((link, index) => (
                  <PlatformLinkButton
                    key={index}
                    link={link}
                    sizeClass='size-[72px]'
                    iconSize={link.icon === 'amazonMusic' ? 50 : 36}
                    labelClass=''
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
