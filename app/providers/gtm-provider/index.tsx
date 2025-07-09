import { useEffect } from "react";
import TagManager from "react-gtm-module";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
export {};

interface GTMProviderProps {
  children: React.ReactNode;
  gtmId: string;
}

export function GTMProvider({ children, gtmId }: GTMProviderProps) {
  const location = useLocation();

  useEffect(() => {
    TagManager.initialize({ gtmId });
  }, [gtmId]);

  useEffect(() => {
    // Push pageview event on route change
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return <>{children}</>;
}
