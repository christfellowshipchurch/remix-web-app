import { useHits } from "react-instantsearch";

// Component that checks if there are hits and conditionally renders content or return null if there are no hits
export const HitsWrapper = ({ children }: { children: React.ReactNode }) => {
  const { items } = useHits();

  // Don't render anything if there are no hits
  if (items.length === 0) {
    return null;
  }

  return <>{children}</>;
};
