/** Skeleton while Filter Sessions InstantSearch mounts after first paint. */
export function ClassSingleFiltersSkeleton() {
  return (
    <div
      className='flex min-w-0 flex-1 flex-wrap items-center gap-2 md:gap-3'
      aria-hidden
    >
      <div className='h-10 w-28 animate-pulse rounded-full bg-neutral-200' />
      <div className='h-10 w-24 animate-pulse rounded-full bg-neutral-200' />
    </div>
  );
}
