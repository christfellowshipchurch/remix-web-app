import { Icon } from '~/primitives/icon/icon';
import { icons } from '~/lib/icons';
import { cn } from '~/lib/utils';

interface HowItWorksCardProps {
  title: string;
  subtitle: string;
  href: string;
  iconName: keyof typeof icons;
  image: string;
  alt: string;
}

export function HowItWorksCard({
  title,
  subtitle,
  href,
  iconName,
  image,
  alt,
}: HowItWorksCardProps) {
  return (
    <a
      href={href}
      className={cn(
        'group relative flex rounded-[20px] overflow-hidden',
        'aspect-4/3 lg:aspect-video',
        'transition-all duration-300 hover:shadow-xl',
      )}
    >
      {/* Background image */}
      <img
        src={image}
        alt={alt}
        className='absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105'
      />

      {/* Blue overlay */}
      <div className='absolute inset-0 bg-linear-to-br from-navy/80 via-navy/55 to-ocean/30' />

      {/* Content */}
      <div className='relative z-10 flex flex-col justify-end size-full p-5'>
        <div className='flex items-end justify-between gap-3'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xl font-extrabold leading-tight text-white'>
              {title}
            </h3>
            <p className='text-sm text-white/80'>{subtitle}</p>
          </div>

          {/* Icon badge */}
          <div className='shrink-0 flex items-center justify-center size-10 rounded-lg bg-white/20 backdrop-blur-sm'>
            <Icon name={iconName} size={20} className='text-white' />
          </div>
        </div>
      </div>
    </a>
  );
}
