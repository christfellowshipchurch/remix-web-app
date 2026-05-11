import Icon from '~/primitives/icon';

export function VolunteerDetailHero({
  title,
  coverImage,
  onBack,
}: {
  title: string;
  coverImage: string | undefined;
  onBack: () => void;
}) {
  return (
    <div className='w-full shrink-0 max-md:px-0 content-padding'>
      <div className='relative mx-auto w-full max-w-content overflow-hidden md:rounded-b-[40px]'>
        {coverImage ? (
          <div className='relative w-full max-md:h-48 md:aspect-video lg:aspect-21/9 lg:max-h-[min(52vh,520px)]'>
            <img
              src={coverImage}
              alt={title}
              className='absolute inset-0 h-full w-full object-cover'
            />
          </div>
        ) : (
          <div className='flex w-full items-center justify-center bg-neutral-lighter text-text-secondary max-md:h-48 md:aspect-video md:min-h-[200px] lg:aspect-21/9 lg:max-h-[min(52vh,520px)]'>
            No image
          </div>
        )}

        <button
          type='button'
          onClick={onBack}
          className='absolute left-4 top-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white text-text-primary shadow-md transition-colors hover:bg-soft-white md:hidden'
          aria-label='Back'
        >
          <Icon name='chevronLeft' size={22} />
        </button>
      </div>
    </div>
  );
}
