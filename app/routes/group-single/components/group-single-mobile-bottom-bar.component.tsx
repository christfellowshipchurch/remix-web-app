import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { GroupConnectModal } from '~/components/modals/group-connect/group-connect-modal';
import { cn } from '~/lib/utils';
import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';

export function GroupSingleMobileBottomBar({
  copied,
  onCopyPath,
  groupId,
}: {
  copied: boolean;
  onCopyPath: () => void;
  groupId: string;
}) {
  /** Portals to `body` so `position: fixed` is not trapped by transform ancestors. */
  const [mountToBody, setMountToBody] = useState(false);

  useLayoutEffect(() => {
    setMountToBody(true);
  }, []);

  /** Keep below site cookie banner (`CookieConsent` uses `z-50`). */
  const bar = (
    <div
      className={cn(
        'w-full fixed inset-x-0 bottom-0 z-30 flex items-stretch gap-3 border-t border-neutral-lighter bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]',
        'md:hidden',
        'pb-[max(1rem,env(safe-area-inset-bottom,0px))]',
      )}
    >
      {copied ? (
        <p
          className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-text-primary px-4 py-2 text-sm font-semibold text-white shadow-md"
          role="status"
          aria-live="polite"
        >
          Link copied
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void onCopyPath()}
        className="flex size-12 shrink-0 items-center justify-center rounded-full border-[0.5px] border-black/12 text-neutral-darker"
        aria-label={copied ? 'Link copied' : 'Share link'}
      >
        <Icon name="shareAlt" size={22} />
      </button>
      <div className="flex min-h-12 min-w-0 flex-1">
        <GroupConnectModal
          groupId={groupId}
          buttonText="I'm Interested"
          ModalButton={(props) => (
            <Button
              intent="primary"
              className="min-h-12 w-full rounded-full text-base font-bold"
              {...props}
            />
          )}
        />
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return bar;
  }

  return mountToBody ? createPortal(bar, document.body) : bar;
}
