import { useEffect, type ReactNode } from 'react';

const MOBILE_MQ = '(max-width: 767px)';

interface MobileScrollLockProps {
  active: boolean;
  children: ReactNode;
}

/**
 * Freezes body scroll on mobile (<768px) while `active` is true.
 * Restores prior scroll position and inline styles on cleanup.
 * No-op on desktop and during SSR. Renders children unchanged.
 */
export function MobileScrollLock({ active, children }: MobileScrollLockProps) {
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    if (!window.matchMedia(MOBILE_MQ).matches) return;

    const scrollY = window.scrollY;
    const prevBody = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.position = prevBody.position;
      document.body.style.top = prevBody.top;
      document.body.style.left = prevBody.left;
      document.body.style.right = prevBody.right;
      document.body.style.width = prevBody.width;
      document.body.style.overflow = prevBody.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [active]);

  return <>{children}</>;
}
