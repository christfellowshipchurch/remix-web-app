import type { ReactNode } from 'react';

import { useStickyTopBelowNavbarClass } from '~/hooks/use-sticky-top-below-navbar';
import { cn } from '~/lib/utils';

type FinderStickyBarProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Sticky filter strip below the main navbar (matches group / class finder finder UIs).
 */
export function FinderStickyBar({ children, className }: FinderStickyBarProps) {
  const stickyTopClass = useStickyTopBelowNavbarClass();
  return (
    <div
      className={cn(
        'sticky z-20 border-b border-black/5 bg-white shadow-sm content-padding select-none transition-all duration-300',
        stickyTopClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
