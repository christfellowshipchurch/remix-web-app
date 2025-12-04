// Declare Wistia types
declare global {
  interface Window {
    _wq: Array<{
      id: string;
      onReady: (video: {
        play: () => Promise<void>;
        pause: () => void;
        muted: (muted: boolean) => void;
      }) => void;
    }>;
  }
}

import { useEffect, useState } from "react";

export function WistiaPlayer({
  videoId,
  wrapper,
  className,
  fallback,
}: {
  className?: string;
  videoId: string;
  wrapper: string;
  fallback?: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Wistia embed code
    const script1 = document.createElement("script");
    script1.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
    script1.async = true;
    const script2 = document.createElement("script");
    script2.src = "https://fast.wistia.com/assets/external/E-v1.js";
    script2.async = true;
    const div = document.createElement("div");
    div.innerHTML = `<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div class="wistia_embed wistia_async_${videoId} seo=false videoFoam=true" style="height:100%;position:relative;width:100%"><div class="wistia_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;"><img src="https://fast.wistia.com/embed/medias/${videoId}/swatch" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="wistia embed" aria-hidden="true" onload="this.parentNode.style.opacity=1;" /></div></div></div></div>`;
    const container = document.getElementById(wrapper);

    if (container) {
      container.appendChild(script1);
      container.appendChild(script2);
      container.appendChild(div);

      // Add event listener for Wistia player ready
      window._wq = window._wq || [];
      window._wq.push({
        id: videoId,
        onReady: () => {
          setIsLoaded(true);
        },
      });

      return () => {
        // Cleanup code
        container.innerHTML = "";
        setIsLoaded(false);
      };
    }
  }, [videoId, wrapper, isMounted]);

  if (!isMounted && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      {fallback && <div className="absolute inset-0 z-0">{fallback}</div>}
      <div
        className={`${className} relative z-10 transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        id={`${wrapper}`}
      />
    </div>
  );
}
