/**
 * Logs LCP and FCP in development or when ?debugWebVitals=1 is present.
 *
 * Uses `web-vitals` for FCP and for LCP when the browser fully supports it.
 * Also registers a **raw** LCP PerformanceObserver that logs `[LCP-raw]` for every
 * dispatched entry (no firstHiddenTime filter) so you can see whether the browser
 * emits LCP at all — `onLCP` can stay silent if supportedEntryTypes omits LCP or
 * if web-vitals filters every entry.
 *
 * Master switch: `DEV_WEB_VITALS_ENABLED` below — set false to disable all logging.
 */
import { onFCP, onLCP } from "web-vitals";

/** Set to `true` to turn dev / `?debugWebVitals=1` logging back on. */
const DEV_WEB_VITALS_ENABLED = false;

/**
 * User-Agent Client Hints (`navigator.userAgentData`). Optional on DOM typings;
 * structural type for Chromium brand detection without relying on `Navigator` in ESLint scope.
 */
type NavigatorUserAgentDataBrands = {
  readonly userAgentData?: {
    readonly brands?: ReadonlyArray<{ readonly brand: string }>;
  };
};

function formatLcpElement(entry: {
  element: Element | null;
  size: number;
  url?: string;
  startTime: number;
}) {
  const el = entry.element;
  return {
    startTimeMs: Math.round(entry.startTime),
    size: entry.size,
    url: entry.url || undefined,
    element: el
      ? {
          tag: el.tagName,
          id: el.id || undefined,
          className:
            typeof el.className === "string"
              ? el.className.slice(0, 120)
              : undefined,
          textPreview: el.textContent?.trim().slice(0, 80) || undefined,
        }
      : null,
  };
}

function logDevWebVitalsDiag(): void {
  const types = PerformanceObserver.supportedEntryTypes ?? [];
  const lcpSupported = types.includes("largest-contentful-paint");
  console.warn("[web-vitals diag]", {
    lcpInSupportedEntryTypes: lcpSupported,
    supportedEntryTypesSample: types.slice(0, 12),
    visibilityState: document.visibilityState,
    prerendering: Boolean(document.prerendering),
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    userAgent: navigator.userAgent.slice(0, 80),
  });

  try {
    const vis = globalThis.performance.getEntriesByType(
      "visibility-state",
    ) as Array<PerformanceEntry & { readonly name?: string }>;
    if (vis.length > 0) {
      console.warn(
        "[web-vitals diag] visibility-state entries (name + startTime ms)",
        vis.map((e) => ({
          name: e.name,
          startTime: Math.round(e.startTime),
        })),
      );
    }
  } catch {
    // ignore
  }
  if (!lcpSupported) {
    console.warn(
      "[web-vitals diag] This engine does not expose largest-contentful-paint to PerformanceObserver. Use Chromium (Chrome/Edge) for LCP; Safari/Firefox support differs.",
    );
  }

  // Safari / all iOS browsers (WKWebView): LCP often appears in supportedEntryTypes but
  // few or no entries are dispatched — FCP still works. Lighthouse uses Chromium.
  //
  // Chrome DevTools "device toolbar" spoofs User-Agent to iPhone/Android Safari strings
  // (no "Chrome/" in UA) while the engine is still Blink — detect Chromium without UA.
  const ua = navigator.userAgent;
  const hasChromiumChromeGlobal =
    typeof (globalThis as { chrome?: unknown }).chrome !== "undefined";
  const uaChromiumToken = /Chrome|Chromium|CriOS|EdgA|EdgiOS|Edg\/|OPR\//.test(
    ua,
  );
  const brandsChromium = Boolean(
    (navigator as NavigatorUserAgentDataBrands).userAgentData?.brands?.some(
      (b) => /Chromium|Google Chrome|Microsoft Edge|Opera/.test(b.brand),
    ),
  );
  const isChromiumFamily =
    uaChromiumToken || hasChromiumChromeGlobal || brandsChromium;
  const isWebKitEngine = /AppleWebKit/.test(ua);
  const uaLooksLikeIosSafari =
    /iPhone|iPad/.test(ua) &&
    isWebKitEngine &&
    !/CriOS|FxiOS/.test(ua) &&
    !uaChromiumToken;

  if (lcpSupported && uaLooksLikeIosSafari && isChromiumFamily) {
    console.warn(
      '[web-vitals diag] User-Agent looks like mobile Safari but this session is Chromium (e.g. Chrome device emulation). LCP should behave like desktop Chrome; do not treat missing [LCP] as "Safari only".',
    );
  }

  if (lcpSupported && isWebKitEngine && !isChromiumFamily) {
    console.warn(
      "[web-vitals diag] WebKit (e.g. Safari or any iOS browser): you may see FCP but never [LCP]/[LCP-raw] — WebKit does not populate LCP the same way as Chrome. Lighthouse scores are Chromium-based; validate LCP in Chrome desktop or Android Chrome.",
    );
  }

  console.warn(
    "[web-vitals diag] Tip: LCP is tied to this navigation. Enable device emulation (or narrow the window), then hard-reload so the first paint uses that viewport — resizing after load can leave no new LCP for the same document.",
  );
  console.warn(
    "[web-vitals diag] Chromium no longer exposes largest-contentful-paint via getEntriesByType() (deprecated, always empty + console warning) — rely on [LCP-raw] / Performance panel.",
  );
}

function registerRawLcpObserver(): void {
  try {
    if (
      !PerformanceObserver.supportedEntryTypes?.includes(
        "largest-contentful-paint",
      )
    ) {
      return;
    }
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & {
          element?: Element | null;
          size?: number;
          url?: string;
        };
        console.warn(
          "[LCP-raw]",
          formatLcpElement({
            startTime: e.startTime,
            size: e.size ?? 0,
            url: e.url,
            element: e.element ?? null,
          }),
        );
      }
    });
    po.observe({ type: "largest-contentful-paint", buffered: true });

    const flushTakeRecords = (label: string) => {
      try {
        const drained = po.takeRecords();
        if (drained.length > 0) {
          console.warn(
            `[LCP-raw] ${label} takeRecords() flush`,
            drained.length,
          );
          for (const entry of drained) {
            const e = entry as PerformanceEntry & {
              element?: Element | null;
              size?: number;
              url?: string;
            };
            console.warn(
              "[LCP-raw]",
              formatLcpElement({
                startTime: e.startTime,
                size: e.size ?? 0,
                url: e.url,
                element: e.element ?? null,
              }),
            );
          }
        }
      } catch (err) {
        console.warn("[LCP-raw] takeRecords failed", err);
      }
    };

    window.setTimeout(() => flushTakeRecords("~2s"), 2000);
    window.setTimeout(() => flushTakeRecords("~6s"), 6000);
  } catch (err) {
    console.warn("[LCP-raw] observer failed", err);
  }
}

export function setupDevWebVitalsLogging(): void {
  if (!DEV_WEB_VITALS_ENABLED) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const enabled =
    import.meta.env.DEV ||
    new URLSearchParams(window.location.search).get("debugWebVitals") === "1";

  if (!enabled) {
    return;
  }

  const w = window as unknown as { __devWebVitalsSetup?: boolean };
  if (w.__devWebVitalsSetup) {
    return;
  }
  w.__devWebVitalsSetup = true;

  logDevWebVitalsDiag();
  registerRawLcpObserver();

  onFCP((metric) => {
    console.warn("[FCP]", {
      startTimeMs: Math.round(metric.value),
      rating: metric.rating,
    });
  });

  onLCP(
    (metric) => {
      const entry = metric.entries.at(-1);
      console.warn("[LCP]", {
        valueMs: Math.round(metric.value),
        rating: metric.rating,
        delta: metric.delta,
        navigationType: metric.navigationType,
        ...(entry
          ? formatLcpElement(
              entry as typeof entry & {
                element: Element | null;
                size: number;
                url?: string;
                startTime: number;
              },
            )
          : { note: "no entry on metric yet" }),
      });
    },
    { reportAllChanges: true },
  );

  console.warn(
    "[web-vitals] onLCP + [LCP-raw] observers. If you see [LCP-raw] but never [LCP], web-vitals is filtering (e.g. firstHiddenTime). Production: ?debugWebVitals=1",
  );
}
