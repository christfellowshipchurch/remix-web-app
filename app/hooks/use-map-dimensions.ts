import { useEffect, useRef, useState } from "react";

export function useMapDimensions() {
  const ref = useRef<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const widthOffsetRatio = 135 / 1030;
    const heightOffsetRatio = 60 / 519;

    const update = () => {
      const { width, height } = ref.current!.getBoundingClientRect();
      const widthOffset = width * widthOffsetRatio;
      const heightOffset = height * heightOffsetRatio;
      setDimensions({
        width: width + widthOffset,
        height: height + heightOffset,
      });
    };

    update(); // initial read

    const observer = new ResizeObserver(update);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  // Calculate offset dynamically based on current width
  const offset = dimensions.width * (140 / 1230); // or use offsetRatio

  return { ref, dimensions, offset };
}
