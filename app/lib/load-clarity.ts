const DEFAULT_CLARITY_ID = 'ojo9prqys0';

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: IArguments[] };
  }
}

/**
 * Idempotent Microsoft Clarity bootstrap. No-ops if Clarity is already present
 * or if a tag script is already in the document.
 */
export function loadClarity(projectId = DEFAULT_CLARITY_ID): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (
    typeof window.clarity === 'function' ||
    document.querySelector('script[src*="clarity.ms/tag/"]')
  ) {
    return;
  }

  // Match Clarity's official stub so queued calls stay compatible.
  window.clarity = function () {
    (window.clarity!.q = window.clarity!.q || []).push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    (document.head || document.documentElement).appendChild(script);
  }
}
