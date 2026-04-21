import { useEffect, useRef, useState } from "react";

import { cn } from "~/lib/utils";

/**
 * Webflow-style defaults (`baseDuration`, `cascadeStep`, `+1s` per counter),
 * scaled ~15% faster (0.85×) so the first digit lands sooner and the cascade follows.
 */
export const DEFAULT_BASE_DURATION_MS = 3400;
export const DEFAULT_CASCADE_STEP_MS = 340;
export const DEFAULT_EXTRA_DURATION_PER_COUNTER_MS = 850;
export const DEFAULT_EM_PER_ROW = 1.2;
export const DEFAULT_INTERSECTION_THRESHOLD = 0.3;

const DIGIT_ROUNDS = 3;

function isStaticChar(digit: string, i: number, target: string): boolean {
  const isFirstDollar = i === 0 && digit === "$";
  const isLastSpecial =
    i === target.length - 1 &&
    (digit === "k" || digit === "+" || digit === "K");
  const isSeparator = digit === "," || digit === ".";
  return isFirstDollar || isLastSpecial || isSeparator;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function Digit({
  digit,
  durationMs,
  emPerRow,
}: {
  digit: string;
  durationMs: number;
  emPerRow: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (collapsed) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRun(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [collapsed]);

  const finalIndex = DIGIT_ROUNDS * 10;
  const translateEm = finalIndex * emPerRow;

  if (collapsed) {
    return (
      <span className="inline-flex h-[1.2em] min-w-[1ch] shrink-0 items-center justify-center font-black tabular-nums leading-none text-white">
        {digit}
      </span>
    );
  }

  return (
    <span className="inline-flex h-[1.2em] min-w-[1ch] shrink-0 overflow-hidden align-middle font-black tabular-nums leading-none text-white">
      <span
        className="flex flex-col will-change-transform"
        style={{
          transform: run ? `translateY(-${translateEm}em)` : "translateY(0)",
          transition: run ? `transform ${durationMs}ms ease-out` : undefined,
        }}
        onTransitionEnd={(e) => {
          if (e.propertyName !== "transform") return;
          setCollapsed(true);
        }}
      >
        {Array.from({ length: DIGIT_ROUNDS * 10 }, (_, idx) => (
          <span
            key={`d-${idx}`}
            className="flex h-[1.2em] shrink-0 items-center justify-center leading-none"
          >
            {idx % 10}
          </span>
        ))}
        <span className="flex h-[1.2em] shrink-0 items-center justify-center leading-none">
          {digit}
        </span>
      </span>
    </span>
  );
}

export type AnimatedStatValueProps = {
  value: string;
  /** Adds length to the roll (same as Webflow’s `counterIndex * 1000`). */
  statCounterIndex?: number;
  className?: string;
  baseDurationMs?: number;
  cascadeStepMs?: number;
  extraDurationPerCounterMs?: number;
  emPerRow?: number;
  /** IntersectionObserver threshold (Webflow used `0.3`). */
  intersectionThreshold?: number;
};

/**
 * Port of the Webflow “number counter”: in-view once, each digit is a vertical
 * stack (0–9 × 3 + final), all rolls start together with staggered **durations**
 * so columns land in sequence; `,` `.` and trailing `k`/`+` stay static.
 */
export function AnimatedStatValue({
  value,
  className,
  statCounterIndex = 0,
  baseDurationMs = DEFAULT_BASE_DURATION_MS,
  cascadeStepMs = DEFAULT_CASCADE_STEP_MS,
  extraDurationPerCounterMs = DEFAULT_EXTRA_DURATION_PER_COUNTER_MS,
  emPerRow = DEFAULT_EM_PER_ROW,
  intersectionThreshold = DEFAULT_INTERSECTION_THRESHOLD,
}: AnimatedStatValueProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setActive(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: intersectionThreshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, intersectionThreshold]);

  const target = value.trim();
  const extraDuration = statCounterIndex * extraDurationPerCounterMs;

  if (reducedMotion || !active) {
    return (
      <span
        ref={containerRef}
        className={cn(
          "inline-flex flex-wrap items-center font-black text-white",
          className,
        )}
        aria-label={target}
      >
        {target}
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className={cn(
        "inline-flex flex-wrap items-center font-black text-white",
        className,
      )}
      aria-label={target}
    >
      <span className="inline-flex items-center" aria-hidden>
        {[...target].map((ch, i) => {
          if (isStaticChar(ch, i, target)) {
            return (
              <span
                key={`${i}-${ch}`}
                className="inline-flex h-[1.2em] shrink-0 items-center justify-center px-0.5 leading-none"
              >
                {ch}
              </span>
            );
          }

          const durationMs = Math.max(
            510,
            baseDurationMs +
              extraDuration -
              cascadeStepMs * (target.length - 1 - i),
          );

          return (
            <Digit
              key={`${i}-${ch}`}
              digit={ch}
              durationMs={durationMs}
              emPerRow={emPerRow}
            />
          );
        })}
      </span>
    </span>
  );
}
