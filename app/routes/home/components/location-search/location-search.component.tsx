import { lazy, Suspense, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

const LocationSearchInner = lazy(() =>
  import("./location-search-inner.component").then((m) => ({
    default: m.LocationSearchInner,
  }))
);

function LocationSearchSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-14 w-full rounded-2xl bg-white/20 animate-pulse md:w-90",
        className
      )}
      aria-hidden
    />
  );
}

export const LocationSearch = ({
  isSearching: controlledIsSearching,
  setIsSearching: controlledSetIsSearching,
}: {
  isSearching?: boolean;
  setIsSearching?: (isSearching: boolean) => void;
} = {}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setReady(true);
    }, 1200);
    return () => clearTimeout(id);
  }, []);

  if (!ready) {
    return <LocationSearchSkeleton />;
  }

  return (
    <Suspense fallback={<LocationSearchSkeleton />}>
      <LocationSearchInner
        isSearching={controlledIsSearching}
        setIsSearching={controlledSetIsSearching}
      />
    </Suspense>
  );
};
