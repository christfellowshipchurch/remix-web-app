import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '~/lib/utils';
import { resolveRockIframeNavigateUrl } from '~/lib/rock-iframe-navigate';
import { getRockEmbedOrigin } from '~/lib/rock-iframe-resize';

type RockProxyMode = 'full' | 'minimal';

interface RockProxyEmbedProps {
  /** The Rock RMS page URL to embed */
  url: string;
  /** Height of the iframe in pixels. Used as the loading placeholder height and initial autoHeight value. */
  height?: number;
  /**
   * When true, the iframe expands to match its content height automatically.
   * Direct Rock embeds (useAdvancedProxy=false) require the Rock page to send
   * `rock-iframe-resize` postMessage events — see /public/rock-iframe-resize.js.
   * Proxied embeds can use same-origin ResizeObserver instead.
   */
  autoHeight?: boolean;
  /** Whether to show a loading state */
  showLoading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /**
   * Whether to use the advanced proxy (better CSS support).
   * When true, uses server-side proxy to handle CORS and CSS issues.
   * When false, embeds directly (may fail due to CORS/X-Frame-Options restrictions).
   */
  useAdvancedProxy?: boolean;
  /**
   * Proxy transformation mode when `useAdvancedProxy` is true.
   * Prefer direct embed for interactive Rock WebForms; proxy breaks postbacks.
   */
  proxyMode?: RockProxyMode;
  /** Additional iframe attributes */
  iframeProps?: React.IframeHTMLAttributes<HTMLIFrameElement>;
  /** Called each time the iframe finishes loading (including after in-frame navigation). */
  onLoad?: () => void;
  /**
   * Called when the Rock page reports validation errors and requests a parent scroll.
   * Requires /public/rock-iframe-resize.js in the embedded Rock page.
   */
  onScrollToTop?: () => void;
}

export function RockProxyEmbed({
  url,
  height = 600,
  autoHeight = false,
  showLoading = true,
  className,
  useAdvancedProxy = true,
  proxyMode = 'full',
  iframeProps = {},
  onLoad,
  onScrollToTop,
}: RockProxyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [autoHeightPx, setAutoHeightPx] = useState(height);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const embedOrigin = useMemo(() => getRockEmbedOrigin(url), [url]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setAutoHeightPx(height);
  }, [url, height]);

  // Attach a ResizeObserver to the iframe body so height tracks DOM changes
  // (e.g. multi-step forms revealing/hiding sections).
  const attachObserver = useCallback(() => {
    if (!autoHeight) return;
    const body = iframeRef.current?.contentDocument?.body;
    if (!body) return;

    observerRef.current?.disconnect();
    observerRef.current = new ResizeObserver(() => {
      const scrollH = iframeRef.current?.contentDocument?.body?.scrollHeight;
      if (scrollH) setAutoHeightPx(scrollH);
    });
    observerRef.current.observe(body);

    // Set initial height immediately
    setAutoHeightPx(body.scrollHeight || height);
  }, [autoHeight, height]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const handleMessage = (event: Event) => {
      const messageEvent = event as Event & {
        data?: { type?: string; height?: number; url?: string };
        origin: string;
        source: unknown;
      };
      if (messageEvent.source !== iframeRef.current?.contentWindow) return;

      const allowedOrigins = new Set(
        [embedOrigin, window.location.origin].filter(Boolean),
      );
      if (!allowedOrigins.has(messageEvent.origin)) return;

      if (messageEvent.data?.type === 'rock-iframe-navigate') {
        const targetUrl = messageEvent.data.url;
        if (typeof targetUrl !== 'string') return;

        const resolved = resolveRockIframeNavigateUrl(
          targetUrl,
          window.location.origin,
        );
        if (!resolved) return;

        window.location.assign(resolved);
        return;
      }

      if (messageEvent.data?.type === 'rock-iframe-scroll-top') {
        onScrollToTop?.();
        iframeRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }

      if (!autoHeight || messageEvent.data?.type !== 'rock-iframe-resize') {
        return;
      }

      const nextHeight = messageEvent.data.height;
      if (typeof nextHeight !== 'number' || nextHeight <= 0) return;

      setAutoHeightPx(nextHeight);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [autoHeight, embedOrigin, onScrollToTop]);

  const requestEmbedHeight = useCallback(() => {
    if (!autoHeight || useAdvancedProxy || !embedOrigin) return;

    iframeRef.current?.contentWindow?.postMessage(
      { type: 'rock-iframe-height-request' },
      embedOrigin,
    );
  }, [autoHeight, useAdvancedProxy, embedOrigin]);

  // Direct Rock embeds are cross-origin; poll for height until Rock page script responds.
  useEffect(() => {
    if (!autoHeight || useAdvancedProxy || !embedOrigin) return;

    requestEmbedHeight();
    const intervalId = window.setInterval(requestEmbedHeight, 400);
    return () => window.clearInterval(intervalId);
  }, [autoHeight, useAdvancedProxy, embedOrigin, url, requestEmbedHeight]);

  const handleLoad = () => {
    setIsLoading(false);
    attachObserver();

    // Rock WebForm step transitions reload or postback inside the iframe; burst
    // height requests so step 2+ content is measured after paint.
    requestEmbedHeight();
    [100, 300, 600, 1200].forEach((delay) => {
      window.setTimeout(requestEmbedHeight, delay);
    });

    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const iframeSrc = useAdvancedProxy
    ? `/rock-proxy?url=${encodeURIComponent(url)}${
        proxyMode === 'minimal' ? '&mode=minimal' : ''
      }`
    : url;

  const resolvedHeight = autoHeight ? autoHeightPx : height;

  const iframeAttributes = {
    ref: iframeRef,
    src: iframeSrc,
    className: cn('w-full border-0', hasError && 'hidden'),
    style: { height: `${resolvedHeight}px` },
    title: 'Rock RMS Embedded Content',
    sandbox:
      'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-fullscreen allow-top-navigation-by-user-activation',
    scrolling: autoHeight ? ('no' as const) : undefined,
    loading: 'lazy' as const,
    onLoad: handleLoad,
    onError: handleError,
    ...iframeProps,
  };

  return (
    <div className={cn('relative', className)}>
      {showLoading && isLoading && (
        <div
          className='flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md'
          style={{ height: `${height}px` }}
        >
          <div className='flex flex-col items-center space-y-2'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <p className='text-sm text-gray-600'>Loading Rock RMS content...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div
          className='flex items-center justify-center bg-red-50 border border-red-200 rounded-md'
          style={{ height: `${height}px` }}
        >
          <div className='text-center'>
            <div className='text-red-600 mb-2'>
              <svg
                className='mx-auto h-8 w-8'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <p className='text-sm text-red-600 font-medium'>
              Failed to load content
            </p>
            <p className='text-xs text-red-500 mt-1'>
              Check the URL and try again
            </p>
          </div>
        </div>
      )}

      <iframe {...iframeAttributes} />
    </div>
  );
}

export default RockProxyEmbed;
