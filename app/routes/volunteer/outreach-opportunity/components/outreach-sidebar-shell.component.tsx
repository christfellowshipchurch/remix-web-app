import type { ReactNode } from 'react';

/** Sticky sidebar card for outreach opportunity detail (mission CTAs). */
export function OutreachSidebarShell({ children }: { children: ReactNode }) {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 space-y-6 rounded-2xl border border-black/6 bg-white p-6 shadow-xs">
        {children}
      </div>
    </aside>
  );
}
