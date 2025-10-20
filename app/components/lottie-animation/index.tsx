import { useEffect, useRef } from "react";
import lottie from "lottie-web";

export function LottieAnimation({
  animationData,
  size = "150px",
}: {
  animationData: object;
  size?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });

      return () => {
        animation.destroy();
      };
    }
  }, [animationData]);

  return (
    <div ref={containerRef} className={`w-${size} h-auto max-w-${size}`} />
  );
}
