import { useState, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

interface RockProxyEmbedProps {
  /** The Rock RMS page URL to embed */
  url: string;
  /** Height of the iframe in pixels */
  height?: number;
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
  /** Additional iframe attributes */
  iframeProps?: React.IframeHTMLAttributes<HTMLIFrameElement>;
}

export function RockProxyEmbed({
  url,
  height = 600,
  showLoading = true,
  className,
  useAdvancedProxy = true,
  iframeProps = {},
}: RockProxyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Build the iframe source URL
  // When useAdvancedProxy is true, use the server-side proxy to handle CORS and CSS issues
  // When false, embed directly (may fail due to CORS/X-Frame-Options restrictions)
  const iframeSrc = useAdvancedProxy
    ? `/rock-page?url=${encodeURIComponent(url)}`
    : url;

  const iframeAttributes = {
    ref: iframeRef,
    src: iframeSrc,
    className: cn("w-full border-0", hasError && "hidden"),
    style: { height: `${height}px` },
    title: "Rock RMS Embedded Content",
    sandbox:
      "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-fullscreen",
    loading: "lazy" as const,
    onLoad: handleLoad,
    onError: handleError,
    ...iframeProps,
  };

  return (
    <div className={cn("relative", className)}>
      {showLoading && isLoading && (
        <div
          className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md"
          style={{ height: `${height}px` }}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading Rock RMS content...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div
          className="flex items-center justify-center bg-red-50 border border-red-200 rounded-md"
          style={{ height: `${height}px` }}
        >
          <div className="text-center">
            <div className="text-red-600 mb-2">
              <svg
                className="mx-auto h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-sm text-red-600 font-medium">
              Failed to load content
            </p>
            <p className="text-xs text-red-500 mt-1">
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
