/** Skeleton while filter InstantSearch mounts after first paint. */
export function ClassFinderFiltersSkeleton() {
  return (
    <div
      className='flex min-w-0 flex-1 flex-wrap items-center gap-2 md:gap-3'
      aria-hidden
    >
      <div className='h-10 w-24 animate-pulse rounded-full bg-neutral-200' />
      <div className='h-10 w-24 animate-pulse rounded-full bg-neutral-200 lg:hidden' />
      <div className='hidden h-10 flex-1 gap-2 lg:flex'>
        <div className='h-10 w-20 animate-pulse rounded-full bg-neutral-200' />
        <div className='h-10 w-20 animate-pulse rounded-full bg-neutral-200' />
        <div className='h-10 w-20 animate-pulse rounded-full bg-neutral-200' />
      </div>
    </div>
  );
}
