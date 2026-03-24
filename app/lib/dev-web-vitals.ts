/**
 * Logs LCP and FCP to the console in development, or when ?debugWebVitals=1 is in the URL.
 * Use this to compare real browser paint timing with Lighthouse (e.g. NO_LCP in lab).
 *
 * Call from the client bundle as early as possible (e.g. top-level in root.tsx). The function
 * no-ops when `window` is undefined (SSR).
 *
 * Note: Chrome deprecates performance.getEntriesByType('largest-contentful-paint') — use only
 * PerformanceObserver here; do not poll the Performance timeline for LCP.
 */

type LcpPerformanceEntry = PerformanceEntry & {
  element?: Element | null;
  size?: number;
  url?: string;
};

function formatLcpPayload(e: LcpPerformanceEntry) {
  const el = e.element;
  return {
    startTimeMs: Math.round(e.startTime),
    size: e.size,
    url: e.url || undefined,
    element: el
      ? {
          tag: el.tagName,
          id: el.id || undefined,
          className:
            typeof el.className === 'string'
              ? el.className.slice(0, 120)
              : undefined,
          textPreview: el.textContent?.trim().slice(0, 80) || undefined,
        }
      : null,
  };
}

export function setupDevWebVitalsLogging(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const enabled =
    import.meta.env.DEV ||
    new URLSearchParams(window.location.search).get('debugWebVitals') === '1';

  if (!enabled) {
    return;
  }

  const w = window as unknown as {
    __devWebVitalsSetup?: boolean;
  };
  if (w.__devWebVitalsSetup) {
    return;
  }
  w.__devWebVitalsSetup = true;

  let sawLcp = false;

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        sawLcp = true;
        console.warn('[LCP]', formatLcpPayload(entry as LcpPerformanceEntry));
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (err) {
    console.warn('[LCP] PerformanceObserver failed', err);
  }

  try {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.warn('[FCP]', { startTimeMs: Math.round(entry.startTime) });
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch (err) {
    console.warn('[FCP] PerformanceObserver failed', err);
  }

  console.warn(
    '[web-vitals] LCP/FCP via PerformanceObserver. Production: add ?debugWebVitals=1 to any URL.'
  );

  window.setTimeout(() => {
    if (!sawLcp) {
      console.warn(
        '[LCP] No LCP entry from PerformanceObserver within 5s. Often: mobile viewport + SSR/hydration timing, Vite dev client, or background tab. Check Performance panel → record → LCP marker, or run Lighthouse on a production build.'
      );
    }
  }, 5000);
}
