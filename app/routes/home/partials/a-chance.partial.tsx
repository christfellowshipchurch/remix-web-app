import { cn } from '~/lib/utils';
import { ImageScrollLayout } from '../components/image-scroll-layout';

export function AChanceSection() {
  return (
    <div className='relative'>
      <h2
        id='a-chance-title'
        className={cn(
          'relative z-20',
          // Sticks while scrolling this section + ImageScrollLayout; scrolls away with them after the block ends (unlike fixed).
          'sticky top-0',
          'min-h-64 sm:min-h-72 md:min-h-64 short-desktop:min-h-48',
          'w-screen text-2xl md:text-[40px] short-desktop:text-[32px] font-extrabold text-center text-pretty',
          'pt-20 lg:pt-24 short-desktop:pt-12 short-desktop:lg:pt-16',
          'px-10 md:px-12',
          'md:w-full',
        )}
      >
        <div
          className={cn(
            'absolute left-0 right-0 top-0 bg-linear-to-b from-white via-white to-transparent z-5',
            'h-64 sm:h-72 md:h-64 short-desktop:h-48',
            'w-screen',
          )}
        />
        <span className='relative z-20'>
          Think of church less as a chore and more as a…{' '}
          <span className='text-ocean'>chance</span>
        </span>
      </h2>
      <ImageScrollLayout />
    </div>
  );
}
