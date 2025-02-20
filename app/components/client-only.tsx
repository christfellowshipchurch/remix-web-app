import { useHydrated } from "~/hooks/use-hydrated";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
