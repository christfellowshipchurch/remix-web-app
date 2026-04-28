import { useEffect, useState } from 'react';

/** Match carousel grid: `grid-cols-1` / `sm:grid-cols-2` / `lg:grid-cols-4` (Tailwind sm 640px, lg 1024px). */
const SM = 640;
const LG = 1024;

function computeCardsPerSlide(): number {
  if (typeof window === 'undefined') {
    return 4;
  }
  const w = window.innerWidth;
  if (w < SM) return 1;
  if (w < LG) return 2;
  return 4;
}

/**
 * Tailwind grid class for each slide so all cards in a chunk stay on one row
 * (avoid `sm:grid-cols-2` with 4 cards → two rows between sm and lg).
 */
export function classSingleCarouselSlideGridColsClass(
  cardsPerSlide: number,
): string {
  if (cardsPerSlide >= 4) return 'grid-cols-4';
  if (cardsPerSlide >= 2) return 'grid-cols-2';
  return 'grid-cols-1';
}

/** One hit per slide; `!basis` wins over CarouselItem `basis-full` (~⅔ width + gap ≈ 1.5 cards). */
export const CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_ITEM_CLASS =
  'min-w-0 shrink-0 grow-0 !basis-[66.666667%]';

export const CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_CONTENT_GAP_CLASS = 'gap-3';

/** `lg` (1024px) and up: chunked multi-card slides; below: single-hit peek rows (Join a Class only). */
export function useMinWidthLg(): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= LG : false,
  );

  useEffect(() => {
    const update = () => setMatches(window.innerWidth >= LG);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return matches;
}

/**
 * Class-single finders only: 1 card per carousel slide on mobile, 2 on tablet, 4 on desktop.
 */
export function useClassSingleCarouselCardsPerSlide(): number {
  const [n, setN] = useState(computeCardsPerSlide);

  useEffect(() => {
    const onResize = () => setN(computeCardsPerSlide());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return n;
}
