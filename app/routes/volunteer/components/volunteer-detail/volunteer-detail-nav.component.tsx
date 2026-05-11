import { cn } from '~/lib/utils';
import Icon from '~/primitives/icon';
import { useStickyTopBelowNavbarClass } from '~/hooks/use-sticky-top-below-navbar';

export function VolunteerDetailNav({
  copied,
  onCopyPath,
  onBack,
  backLabel = 'Back to opportunities',
}: {
  copied: boolean;
  onCopyPath: () => void;
  onBack: () => void;
  backLabel?: string;
}) {
  const stickyTopClass = useStickyTopBelowNavbarClass();

  return (
    <header
      className={cn(
        'hidden shrink-0 border-b border-neutral-lighter bg-white md:block sticky z-30 shadow-sm',
        'content-padding w-full',
        stickyTopClass,
      )}
    >
      <div className='mx-auto flex max-w-content items-center justify-end gap-4 py-4 sm:justify-between'>
        <button
          type='button'
          onClick={onBack}
          className='hidden cursor-pointer items-center gap-2 text-sm font-semibold text-neutral-darker transition-all duration-300 hover:text-ocean sm:inline-flex'
        >
          <Icon name='chevronLeft' size={20} className='shrink-0' />
          {backLabel}
        </button>
        <button
          type='button'
          onClick={() => void onCopyPath()}
          className='inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-4 py-2 text-sm font-semibold text-neutral-darker shadow-sm transition-all duration-300 hover:border-ocean hover:text-ocean'
        >
          <Icon name='shareAlt' size={18} className='shrink-0' />
          <span className={cn(copied && 'text-ocean')}>
            {copied ? 'Link copied' : 'Share'}
          </span>
        </button>
      </div>
    </header>
  );
}
