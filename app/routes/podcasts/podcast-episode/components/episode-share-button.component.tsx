import { useCopyPagePath } from '~/hooks/use-copy-page-path';
import { cn } from '~/lib/utils';
import Icon from '~/primitives/icon';

export function EpisodeShareButton({
  className,
  iconClasses,
}: {
  className?: string;
  iconClasses?: string;
}) {
  const { copyPath, copied } = useCopyPagePath();

  return (
    <button
      type='button'
      onClick={() => void copyPath()}
      className='group inline-flex w-fit items-center'
      aria-label='Share this episode'
    >
      <span
        className={cn(
          'inline-flex min-h-12 items-center justify-center border border-ocean px-6 py-3 font-semibold text-ocean transition-colors group-hover:bg-current/10',
          className,
        )}
      >
        {copied ? 'Link copied' : 'Share this episode'}
      </span>
      <Icon
        name='arrowBack'
        className={cn(
          'ml-[-0.75rem] size-10 rounded-full bg-ocean p-2 text-white rotate-[135deg] transition-transform duration-300 group-hover:rotate-180',
          iconClasses,
        )}
        size={20}
      />
    </button>
  );
}
