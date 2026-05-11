import type { ReactNode } from 'react';

/** Sticky sidebar card for church serving area (desktop role selector). */
export function ChurchSidebarShell({ children }: { children: ReactNode }) {
  return (
    <aside className='hidden md:block'>
      <div className='sticky top-24 space-y-6'>{children}</div>
    </aside>
  );
}
