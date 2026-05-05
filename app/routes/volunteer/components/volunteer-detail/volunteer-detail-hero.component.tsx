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
    <div className='w-full shrink-0'>
      <div className='relative overflow-hidden content-padding max-w-screen-content mx-auto'>
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className='aspect-21/9 max-h-[min(52vh,520px)] w-full object-cover sm:aspect-video lg:aspect-21/9 rounded-b-[40px]'
          />
        ) : (
          <div className='flex aspect-video min-h-[200px] w-full items-center justify-center bg-neutral-lighter text-text-secondary'>
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
