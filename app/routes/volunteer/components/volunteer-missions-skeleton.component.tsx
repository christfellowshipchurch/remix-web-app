import { cn } from "~/lib/utils";

/**
 * Placeholder UI for the missions block (filters + horizontal cards) while
 * Algolia is connecting and the first search is in flight.
 */
export function VolunteerMissionsSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("animate-pulse content-padding 2xl:px-0", className)}
      aria-hidden
    >
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <div className="h-11 w-36 rounded-full bg-neutral-light" />
          <div className="h-11 w-28 rounded-full bg-neutral-light" />
          <div className="h-11 w-28 rounded-full bg-neutral-light" />
          <div className="h-11 w-32 rounded-full bg-neutral-light" />
        </div>
        <div className="h-12 w-full rounded-lg bg-neutral-light md:w-80" />
      </div>

      <div className="mt-8 flex items-stretch gap-6 overflow-hidden pl-5 md:pl-12 lg:pl-18 2xl:pl-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex h-full w-full min-w-0 shrink-0 basis-[85vw] flex-col overflow-hidden rounded-2xl bg-white shadow-sm sm:basis-[45%] md:basis-[40%] lg:basis-[33.33%]"
          >
            <div className="aspect-[16/10] w-full max-h-[156px] shrink-0 bg-neutral-light" />
            <div className="flex min-h-[140px] flex-1 flex-col gap-3 p-5">
              <div className="h-6 w-full max-w-[280px] rounded-md bg-neutral-light" />
              <div className="flex gap-2">
                <div className="h-7 w-24 rounded-full bg-neutral-light" />
                <div className="h-7 w-28 rounded-md bg-neutral-light" />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-32 rounded-full bg-neutral-light" />
                <div className="h-7 w-28 rounded-full bg-neutral-light" />
              </div>
              <div className="mt-1 flex flex-col gap-2">
                <div className="h-4 w-full max-w-[200px] rounded bg-neutral-light" />
                <div className="h-4 w-full max-w-[160px] rounded bg-neutral-light" />
                <div className="h-4 w-full max-w-[180px] rounded bg-neutral-light" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-8 min-h-[4.5rem] pb-14 sm:pb-16 md:pb-8">
        <div className="absolute left-4 top-1 flex gap-2 md:left-0 md:top-7">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="size-2.5 rounded-full bg-neutral-light md:size-3"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
