import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type GlobalSearchLocationContextValue = {
  hasMatchingLocations: boolean;
  setHasMatchingLocations: (hasMatchingLocations: boolean) => void;
};

const GlobalSearchLocationContext =
  createContext<GlobalSearchLocationContextValue | null>(null);

export function GlobalSearchLocationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hasMatchingLocations, setHasMatchingLocations] = useState(false);

  const value = useMemo(
    () => ({ hasMatchingLocations, setHasMatchingLocations }),
    [hasMatchingLocations],
  );

  return (
    <GlobalSearchLocationContext.Provider value={value}>
      {children}
    </GlobalSearchLocationContext.Provider>
  );
}

export function useGlobalSearchLocationMatches() {
  const context = useContext(GlobalSearchLocationContext);

  if (!context) {
    throw new Error(
      'useGlobalSearchLocationMatches must be used within GlobalSearchLocationProvider',
    );
  }

  return context;
}
