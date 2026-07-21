import { useEffect } from 'react';

/**
 * Loads GTM after idle so first paint is not blocked by googletagmanager.com.
 * Consent defaults remain in root Layout (inline, before any GTM network).
 */
export function DeferredGtm({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    const load = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(script);
    };
    const id = window.setTimeout(load, 0);
    return () => clearTimeout(id);
  }, [gtmId]);

  return null;
}
